import { ConflictException, Injectable } from '@nestjs/common';
import { Routes } from 'src/core/enums/app.enums';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { CreatePostAttachmentDto } from 'src/modules/post/submodules/post-attachment/DTO/create-post-attachment.dto';
import { UpdatePostAttachmentDto } from 'src/modules/post/submodules/post-attachment/DTO/update-post-attachment.dto';
import { PostAttachmentEntity } from 'src/modules/post/submodules/post-attachment/entities/post-attachment.entity';
import { CreatePostAttachmentUploadedFiles } from 'src/modules/post/submodules/post-attachment/types/post-attachment.types';
import { v7 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class PostAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async findAllForPost(postId: PostEntity['id']): Promise<PostAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return tx.postAttachment.findMany({ where: { postId } });
    });
  }

  public async findById(id: PostEntity['id']): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.findUniqueOrThrow({ where: { id } });
  }

  public async setPostAttachments(
    postId: PostEntity['id'],
    data: CreatePostAttachmentDto[],
  ): Promise<PostAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postAttachment.deleteMany({ where: { postId } });
      await tx.postAttachment.createMany({ data: data.map(item => ({ ...item, postId })) });

      return tx.postAttachment.findMany({ where: { postId } });
    });
  }

  public async update(
    id: string,
    data: UpdatePostAttachmentDto,
    files?: CreatePostAttachmentUploadedFiles,
  ): Promise<PostAttachmentEntity> {
    if (!files?.file?.length) {
      throw new ConflictException(
        'Cannot update post attachment. The attachment file was not provided.',
      );
    }

    return this.prismaService.postAttachment
      .update({ data, where: { id } })
      .then(postAttachment => {
        if (files?.file?.length) {
          const file = files.file[0];

          const filename = `${Routes.Posts}/attachments/${uuid()}${path.extname(file.originalname)}`;

          this.supabaseService.upload(file, filename).then(async response => {
            if (response.file.filename) {
              await this.prismaService.postAttachment.update({
                where: { id: postAttachment.id },
                data: { location: response.file.filename },
              });
            }
          });
        }

        return postAttachment;
      });
  }

  public async remove(id: string): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.delete({ where: { id } }).then(postAttachment => {
      this.supabaseService.remove([postAttachment.location]);

      return postAttachment;
    });
  }
}
