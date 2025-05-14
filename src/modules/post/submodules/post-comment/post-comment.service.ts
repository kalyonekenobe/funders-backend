import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { CreatePostCommentDto } from 'src/modules/post/submodules/post-comment/DTO/create-post-comment.dto';
import {
  CreatePostCommentUploadedFiles,
  UpdatePostCommentUploadedFiles,
} from 'src/modules/post/submodules/post-comment/types/post-comment.types';
import { UpdatePostCommentDto } from 'src/modules/post/submodules/post-comment/DTO/update-post-comment.dto';
import { Routes } from 'src/core/enums/app.enums';
import { v7 as uuid } from 'uuid';
import * as path from 'path';
import { GeminiService } from 'src/modules/infrastructure/gemini/gemini.service';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class PostCommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly geminiService: GeminiService,
    private readonly loggerService: LoggerService,
  ) {}

  public async findAllForPost(postId: string): Promise<PostCommentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });

      return tx.postComment.findMany({ where: { postId }, include: { replies: true } });
    });
  }

  public async findAllForUser(authorId: string): Promise<PostCommentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: authorId } });

      return tx.postComment.findMany({ where: { authorId }, include: { replies: true } });
    });
  }

  public async findById(id: string): Promise<PostCommentEntity> {
    return this.prismaService.postComment.findUniqueOrThrow({ where: { id } });
  }

  public async create(
    postId: string,
    data: CreatePostCommentDto,
    files?: CreatePostCommentUploadedFiles,
    options?: Omit<Prisma.PostCommentCreateArgs, 'data'>,
  ): Promise<PostCommentEntity> {
    const { attachments, ...dataWithoutAttachments } = data;

    return this.prismaService.postComment
      .create(
        _.merge(options, {
          data: { ...dataWithoutAttachments, postId },
          include: { attachments: true },
        }),
      )
      .then(async postComment => {
        this.geminiService
          .checkForSpamOrInsultingContent(postComment.content)
          .then(async result => {
            if (result) {
              await this.prismaService.postComment.delete({ where: { id: postComment.id } });

              this.loggerService.log(
                `The post comment with id: ${postComment.id} was deleted due to the spam or insulting content`,
                PostCommentService.name,
              );
            }
          })
          .catch(error => {
            this.loggerService.error(error.message, error.stack, PostCommentService.name);
          });

        if (files?.attachments?.length) {
          Promise.all(
            files.attachments.map(attachment => {
              const filename = `${Routes.PostComments}/attachments/${uuid()}${path.extname(attachment.originalname)}`;

              return this.supabaseService
                .upload(attachment, filename)
                .then(result => ({ result, location: filename }));
            }),
          ).then(
            async uploadedFiles =>
              await this.prismaService.postComment.update({
                where: { id: postComment.id },
                data: {
                  attachments: {
                    createMany: {
                      data: uploadedFiles.map((attachment, index) => ({
                        ...(attachments?.[index] || {}),
                        location: attachment.location,
                      })),
                    },
                  },
                },
              }),
          );
        }

        return postComment;
      });
  }

  public async update(
    id: string,
    data: UpdatePostCommentDto,
    files?: UpdatePostCommentUploadedFiles,
    options?: Omit<Prisma.PostCommentUpdateArgs, 'data' | 'where'>,
  ): Promise<PostCommentEntity> {
    await this.prismaService.postComment.findUniqueOrThrow({
      where: { id },
      select: { attachments: true },
    });

    const { attachments, ...dataWithoutAttachments } = data;

    return this.prismaService.postComment
      .update(
        _.merge(options, {
          where: { id },
          include: { attachments: true },
          data: dataWithoutAttachments,
        }),
      )
      .then(async ({ attachments: attachmentsInPostComment, ...postComment }) => {
        this.geminiService
          .checkForSpamOrInsultingContent(postComment.content)
          .then(async result => {
            if (result) {
              await this.prismaService.postComment.delete({ where: { id: postComment.id } });

              this.loggerService.log(
                `The post comment with id: ${postComment.id} was deleted due to the spam or insulting content`,
                PostCommentService.name,
              );
            }
          })
          .catch(error => {
            this.loggerService.error(error.message, error.stack, PostCommentService.name);
          });

        if (!attachments?.length && !files?.attachments?.length) {
          await this.prismaService.postComment.update({
            where: { id: postComment.id },
            data: { attachments: { deleteMany: {} } },
          });

          this.supabaseService.remove(
            attachmentsInPostComment.map(attachment => attachment.location),
          );

          return postComment;
        }

        if (files?.attachments?.length) {
          Promise.all(
            files.attachments.map(attachment => {
              const filename = `${Routes.PostComments}/attachments/${uuid()}${path.extname(attachment.originalname)}`;

              return this.supabaseService
                .upload(attachment, filename)
                .then(result => ({ result, location: filename }));
            }),
          ).then(async uploadedFiles => {
            await this.prismaService.postComment.update({
              where: { id: postComment.id },
              data: {
                attachments: {
                  deleteMany: {},
                  createMany: {
                    data: uploadedFiles.map((attachment, index) => ({
                      ...(attachments?.[index] || {}),
                      location: attachment.location,
                    })),
                  },
                },
              },
            });

            this.supabaseService.remove(
              attachmentsInPostComment.map(attachment => attachment.location),
            );
          });
        }

        return { ...postComment, attachments: attachmentsInPostComment };
      });
  }

  public async remove(id: string): Promise<PostCommentEntity> {
    return this.prismaService.postComment
      .delete({ where: { id }, include: { attachments: true } })
      .then(({ attachments, ...postComment }) => {
        if (attachments.length) {
          this.supabaseService.remove(attachments.map(attachment => attachment.location));
        }

        return postComment;
      });
  }
}
