import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import { Prisma } from '@prisma/client';
import { ChatMessageAttachmentEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/entities/chat-message-attachment.entity';
import * as _ from 'lodash';
import { CreateChatMessageAttachmentDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/DTO/create-chat-message-attachment.dto';
import { UpdateChatMessageAttachmentDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/DTO/update-chat-message-attachment.dto';
import { UpdateChatMessageAttachmentUploadedFiles } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/types/chat-message-attachment.types';
import { Routes } from 'src/core/enums/app.enums';
import { v7 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class ChatMessageAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async findAll(
    options?: Prisma.ChatMessageAttachmentFindManyArgs,
  ): Promise<ChatMessageAttachmentEntity[]> {
    if (options) {
      return this.prismaService.chatMessageAttachment.findMany(options);
    }

    return this.prismaService.chatMessageAttachment.findMany();
  }

  public async findAllForChatMessage(
    messageId: string,
    options?: Prisma.ChatMessageAttachmentFindManyArgs,
  ): Promise<ChatMessageAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chatMessage.findUniqueOrThrow({ where: { id: messageId } });

      return tx.chatMessageAttachment.findMany(_.merge(options, { where: { messageId } }));
    });
  }

  public async findOne(
    options: Prisma.ChatMessageAttachmentFindUniqueOrThrowArgs,
  ): Promise<ChatMessageAttachmentEntity> {
    return this.prismaService.chatMessageAttachment.findUniqueOrThrow(options);
  }

  public async create(
    data: CreateChatMessageAttachmentDto,
    files?: UpdateChatMessageAttachmentUploadedFiles,
  ): Promise<ChatMessageAttachmentEntity> {
    const location = files?.location?.[0];

    if (!location) {
      throw new ConflictException(
        'The chat message attachment file is missing. Please, upload one',
      );
    }

    return this.prismaService.chatMessageAttachment
      .create({ data })
      .then(async chatMessageAttachment => {
        const filename = `${Routes.ChatMessageAttachments}/${uuid()}${path.extname(location.originalname)}`;

        this.supabaseService.upload(location, filename).then(async response => {
          if (response.file.filename) {
            await this.prismaService.chatMessageAttachment.update({
              where: { id: chatMessageAttachment.id },
              data: { location: response.file.filename },
            });

            if (chatMessageAttachment.location) {
              this.supabaseService.remove([chatMessageAttachment.location]);
            }
          }
        });

        return chatMessageAttachment;
      });
  }

  public async update(
    id: string,
    data: UpdateChatMessageAttachmentDto,
    files?: UpdateChatMessageAttachmentUploadedFiles,
  ): Promise<ChatMessageAttachmentEntity> {
    const { location: locationInDto, ...dataWithoutLocation } = data;
    const location = files?.location?.[0];

    if (!location) {
      throw new ConflictException(
        'The chat message attachment file is missing. Please, upload one',
      );
    }

    return this.prismaService.chatMessageAttachment
      .update({ data: dataWithoutLocation, where: { id } })
      .then(async chatMessageAttachment => {
        const filename = `${Routes.ChatMessageAttachments}/${uuid()}${path.extname(location.originalname)}`;

        this.supabaseService.upload(location, filename).then(async response => {
          if (response.file.filename) {
            await this.prismaService.chatMessageAttachment.update({
              where: { id: chatMessageAttachment.id },
              data: { location: response.file.filename },
            });

            if (chatMessageAttachment.location) {
              this.supabaseService.remove([chatMessageAttachment.location]);
            }
          }
        });

        return chatMessageAttachment;
      });
  }

  public async remove(id: string): Promise<ChatMessageAttachmentEntity> {
    return this.prismaService.chatMessageAttachment
      .delete({ where: { id } })
      .then(async chatMessageAttachment => {
        if (chatMessageAttachment.location) {
          this.supabaseService.remove([chatMessageAttachment.location]);
        }

        return chatMessageAttachment;
      });
  }
}
