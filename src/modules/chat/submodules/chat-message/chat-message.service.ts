import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Routes } from 'src/core/enums/app.enums';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import { CreateChatMessageDto } from 'src/modules/chat/submodules/chat-message/DTO/create-chat-message.dto';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import {
  CreateChatMessageUploadedFiles,
  UpdateChatMessageUploadedFiles,
} from 'src/modules/chat/submodules/chat-message/types/chat-message.types';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { v7 as uuid } from 'uuid';
import * as _ from 'lodash';
import * as path from 'path';
import { UpdateChatMessageDto } from 'src/modules/chat/submodules/chat-message/DTO/update-chat-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async findAll(options?: Prisma.ChatMessageFindManyArgs): Promise<ChatMessageEntity[]> {
    if (options) {
      return this.prismaService.chatMessage.findMany(options);
    }

    return this.prismaService.chatMessage.findMany();
  }

  public async findAllForChat(
    chatId: ChatEntity['id'],
    options?: Prisma.ChatMessageFindManyArgs,
  ): Promise<ChatMessageEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });

      return tx.chatMessage.findMany(
        _.merge(options, { where: { chatId }, include: { replies: true } }),
      );
    });
  }

  public async findOne(
    options: Prisma.ChatMessageFindUniqueOrThrowArgs,
  ): Promise<ChatMessageEntity> {
    return this.prismaService.chatMessage.findUniqueOrThrow(options);
  }

  public async create(
    data: CreateChatMessageDto,
    files?: CreateChatMessageUploadedFiles,
  ): Promise<ChatMessageEntity> {
    const { attachments: attachmentsInData, ...dataWithoutAttachments } = data;

    return this.prismaService.chatMessage
      .create({
        data: {
          ...dataWithoutAttachments,
          chatId: dataWithoutAttachments.chatId || '',
          authorId: dataWithoutAttachments.authorId || '',
          ...(attachmentsInData && {
            attachments: {
              createMany: {
                data: attachmentsInData,
                skipDuplicates: false,
              },
            },
          }),
        },
      })
      .then(async chatMessage => {
        const attachments = files?.attachments;

        if (attachments) {
          Promise.allSettled(
            attachments.map((attachment, index) => {
              const filename = `${Routes.ChatMessageAttachments}/${uuid()}${path.extname(attachment.originalname)}`;

              this.supabaseService.upload(attachment, filename).then(async response => {
                if (response.file.filename) {
                  await this.prismaService.chatMessageAttachment.create({
                    data: {
                      messageId: chatMessage.id,
                      filename: attachmentsInData?.[index]?.filename,
                      location: response.file.filename,
                    },
                  });
                }
              });
            }),
          );
        }

        return chatMessage;
      });
  }

  public async update(
    id: string,
    data: UpdateChatMessageDto,
    files?: UpdateChatMessageUploadedFiles,
  ): Promise<ChatMessageEntity> {
    const { attachments: attachmentsInData, ...dataWithoutAttachments } = data;

    const chatMessage = await this.prismaService.chatMessage.findUniqueOrThrow({
      where: { id },
      select: { attachments: true },
    });

    const shouldAttachmentsBeDeleted =
      ((files?.attachments && files.attachments.length > 0) || files?.attachments !== undefined) &&
      chatMessage.attachments.length > 0;

    return this.prismaService.chatMessage
      .update({
        where: { id },
        data: {
          ...dataWithoutAttachments,
          attachments: {
            ...(shouldAttachmentsBeDeleted && {
              deleteMany: {},
            }),
            ...(attachmentsInData && {
              createMany: {
                data: attachmentsInData?.map(attachment => ({
                  ...attachment,
                  location: attachment.location || '',
                })),
                skipDuplicates: false,
              },
            }),
          },
        },
      })
      .then(async updatedChatMessage => {
        const attachments = files?.attachments;

        if (attachments) {
          Promise.allSettled(
            attachments.map((attachment, index) => {
              const filename = `${Routes.ChatMessageAttachments}/${uuid()}${path.extname(attachment.originalname)}`;

              this.supabaseService.upload(attachment, filename).then(async response => {
                if (response.file.filename) {
                  await this.prismaService.chatMessageAttachment.create({
                    data: {
                      messageId: updatedChatMessage.id,
                      filename: attachmentsInData?.[index]?.filename,
                      location: response.file.filename,
                    },
                  });
                }
              });
            }),
          );
        }

        if (shouldAttachmentsBeDeleted) {
          this.supabaseService.remove(
            chatMessage.attachments.map(attachment => attachment.location),
          );
        }

        return updatedChatMessage;
      });
  }

  public async remove(id: string): Promise<ChatMessageEntity> {
    return this.prismaService.chatMessage
      .delete({ where: { id }, include: { attachments: true } })
      .then(chatMessage => {
        if (chatMessage.attachments.length) {
          this.supabaseService.remove(
            chatMessage.attachments.map(attachment => attachment.location),
          );
        }

        return chatMessage;
      });
  }
}
