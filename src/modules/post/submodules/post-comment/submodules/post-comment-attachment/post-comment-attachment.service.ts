import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { PostCommentAttachmentEntity } from './entities/post-comment-attachment.entity';
import { UpdatePostCommentAttachmentDto } from './DTO/update-post-comment-attachment.dto';
import { CreatePostCommentAttachmentDto } from './DTO/create-post-comment-attachment.dto';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { UpdatePostCommentAttachmentUploadedFiles } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/types/post-comment-attachment.types';
import { Routes } from 'src/core/enums/app.enums';
import { v7 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class PostCommentAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async findAllForComment(
    commentId: PostCommentEntity['id'],
  ): Promise<PostCommentAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postComment.findUniqueOrThrow({ where: { id: commentId } });
      return tx.postCommentAttachment.findMany({ where: { commentId } });
    });
  }

  public async findById(id: PostCommentEntity['id']): Promise<PostCommentAttachmentEntity> {
    return this.prismaService.postCommentAttachment.findUniqueOrThrow({ where: { id } });
  }

  public async setPostCommentAttachments(
    commentId: PostCommentEntity['id'],
    data: CreatePostCommentAttachmentDto[],
  ): Promise<PostCommentAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postCommentAttachment.deleteMany({ where: { commentId } });
      await tx.postCommentAttachment.createMany({
        data: data.map(item => ({ ...item, commentId })),
      });

      return tx.postCommentAttachment.findMany({ where: { commentId } });
    });
  }

  public async update(
    id: PostCommentAttachmentEntity['id'],
    data: UpdatePostCommentAttachmentDto,
    files?: UpdatePostCommentAttachmentUploadedFiles,
  ): Promise<PostCommentAttachmentEntity> {
    if (!files?.file?.length) {
      throw new ConflictException(
        'Cannot update post comment attachment. The attachment file was not provided.',
      );
    }

    return this.prismaService.postCommentAttachment
      .update({ data, where: { id } })
      .then(postCommentAttachment => {
        if (files?.file?.length) {
          const file = files.file[0];

          const filename = `${Routes.PostComments}/attachments/${uuid()}${path.extname(file.originalname)}`;

          this.supabaseService.upload(file, filename).then(async response => {
            if (response.file.filename) {
              await this.prismaService.postCommentAttachment.update({
                where: { id: postCommentAttachment.id },
                data: { location: response.file.filename },
              });
            }
          });
        }

        return postCommentAttachment;
      });
  }

  public async remove(id: PostCommentAttachmentEntity['id']): Promise<PostCommentAttachmentEntity> {
    return this.prismaService.postCommentAttachment
      .delete({ where: { id } })
      .then(postCommentAttachment => {
        this.supabaseService.remove([postCommentAttachment.location]);

        return postCommentAttachment;
      });
  }
}
