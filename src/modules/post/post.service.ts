import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './DTO/create-post.dto';
import { UpdatePostDto } from './DTO/update-post.dto';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import {
  CreatePostUploadedFiles,
  UpdatePostUploadedFiles,
} from 'src/modules/post/types/post.types';
import { Routes } from 'src/core/enums/app.enums';
import { v7 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async findAll(options?: Prisma.PostFindManyArgs): Promise<PostEntity[]> {
    return Object.entries(options || {}).length > 0
      ? this.prismaService.post.findMany(options)
      : this.prismaService.post.findMany();
  }

  public async findById(
    id: PostEntity['id'],
    options?: Omit<Prisma.PostFindUniqueOrThrowArgs, 'where'>,
  ): Promise<PostEntity> {
    return this.prismaService.post.findUniqueOrThrow(_.merge(options, { where: { id } }));
  }

  public async findAllUserPosts(userId: string): Promise<PostEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return tx.post.findMany({ where: { authorId: userId } });
    });
  }

  public async create(data: CreatePostDto, files?: CreatePostUploadedFiles): Promise<PostEntity> {
    const { attachments, image, categories, ...dataWithoutImageCategoriesAndAttachments } = data;

    return this.prismaService.post
      .create({
        data: {
          ...dataWithoutImageCategoriesAndAttachments,
          image: null,
          authorId: data.authorId || '',
          categoriesToPosts: {
            createMany: {
              data: data.categories || [],
              skipDuplicates: false,
            },
          },
        },
      })
      .then(async post => {
        if (files?.image?.length) {
          const image = files?.image[0];
          const filename = `${Routes.Posts}/${uuid()}${path.extname(image.originalname)}`;

          this.supabaseService.upload(image, filename).then(async response => {
            if (response.file.filename) {
              await this.prismaService.post.update({
                where: { id: post.id },
                data: { image: response.file.filename },
              });
            }
          });
        }

        if (files?.attachments?.length) {
          Promise.all(
            files.attachments.map(attachment => {
              const filename = `${Routes.Posts}/attachments/${uuid()}${path.extname(attachment.originalname)}`;

              return this.supabaseService
                .upload(attachment, filename)
                .then(result => ({ result, location: filename }));
            }),
          ).then(
            async uploadedFiles =>
              await this.prismaService.post.update({
                where: { id: post.id },
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

        return post;
      });
  }

  public async update(
    id: PostEntity['id'],
    data: UpdatePostDto,
    files?: UpdatePostUploadedFiles,
  ): Promise<PostEntity> {
    await this.prismaService.post.findUniqueOrThrow({
      where: { id },
      select: { image: true, attachments: true },
    });

    const { image, attachments, categories, ...dataWithoutImageCategoriesAndAttachments } = data;

    return this.prismaService.post
      .update({
        where: { id },
        include: { attachments: true },
        data: {
          ...dataWithoutImageCategoriesAndAttachments,
          categoriesToPosts: {
            deleteMany: {},
            createMany: {
              data: data.categories || [],
              skipDuplicates: true,
            },
          },
        },
      })
      .then(async ({ attachments: attachmentsInPost, ...post }) => {
        if (image === 'null') {
          await this.prismaService.post.update({
            where: { id: post.id },
            data: { image: null },
          });

          if (post.image) {
            this.supabaseService.remove([post.image]);
          }
        }

        if (files?.image?.length) {
          const image = files?.image[0];
          const filename = `${Routes.Posts}/${uuid()}${path.extname(image.originalname)}`;

          this.supabaseService.upload(image, filename).then(async response => {
            if (response.file.filename) {
              await this.prismaService.post.update({
                where: { id: post.id },
                data: { image: response.file.filename },
              });
            }
          });

          if (post.image) {
            this.supabaseService.remove([post.image]);
          }
        }

        if (!attachments?.length && !files?.attachments?.length) {
          await this.prismaService.post.update({
            where: { id: post.id },
            data: { attachments: { deleteMany: {} } },
          });

          this.supabaseService.remove(attachmentsInPost.map(attachment => attachment.location));

          return post;
        }

        if (files?.attachments?.length) {
          Promise.all(
            files.attachments.map(attachment => {
              const filename = `${Routes.Posts}/attachments/${uuid()}${path.extname(attachment.originalname)}`;

              return this.supabaseService
                .upload(attachment, filename)
                .then(result => ({ result, location: filename }));
            }),
          ).then(async uploadedFiles => {
            await this.prismaService.post.update({
              where: { id: post.id },
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

            this.supabaseService.remove(attachmentsInPost.map(attachment => attachment.location));
          });
        }

        return post;
      });
  }

  public async remove(id: PostEntity['id']): Promise<PostEntity> {
    return this.prismaService.post
      .delete({ where: { id }, include: { attachments: true } })
      .then(({ attachments, ...post }) => {
        if (attachments.length) {
          this.supabaseService.remove(attachments.map(attachment => attachment.location));
        }

        return post;
      });
  }
}
