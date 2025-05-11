import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as path from 'path';
import { Routes } from 'src/core/enums/app.enums';
import { CreateChatDto } from 'src/modules/chat/DTO/create-chat.dto';
import { UpdateChatDto } from 'src/modules/chat/DTO/update-chat.dto';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import {
  CreateChatUploadedFiles,
  UpdateChatUploadedFiles,
} from 'src/modules/chat/types/chat.types';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { SupabaseService } from 'src/modules/infrastructure/supabase/supabase.service';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { v7 as uuid } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async findAll(options?: Prisma.ChatFindManyArgs): Promise<ChatEntity[]> {
    if (options) {
      return this.prismaService.chat.findMany(options);
    }

    return this.prismaService.chat.findMany();
  }

  public async findOne(options: Prisma.ChatFindUniqueOrThrowArgs): Promise<ChatEntity> {
    return this.prismaService.chat.findUniqueOrThrow(options);
  }

  public async getChatListForUser(
    authenticatedUser: UserPublicEntity,
    options?: Prisma.ChatFindManyArgs,
  ): Promise<ChatEntity[]> {
    const chats = await this.prismaService.$queryRaw<ChatEntity[]>`
      SELECT c.*, 
             COALESCE(JSON_AGG(cm) FILTER (WHERE cm."id" IS NOT NULL), '[]') AS messages, 
             COALESCE(unread_count.total_unread, 0) AS "totalUnreadMessages"
      FROM "Chat" c
      LEFT JOIN LATERAL (
        SELECT * 
        FROM "ChatMessage" cm
        WHERE cm."chatId" = c."id"
        AND cm."removedAt" IS NULL
        ORDER BY cm."createdAt" DESC
        LIMIT 1
      ) cm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS total_unread
        FROM "ChatMessage" cm
        WHERE cm."chatId" = c."id"
          AND cm."createdAt" > (
            SELECT "lastSeenMessageTimestamp"
            FROM "ChatToUser" utc
            WHERE utc."userId" = CAST(${authenticatedUser.id} AS uuid) 
              AND utc."chatId" = c."id"
          )
          AND cm."authorId" != CAST(${authenticatedUser.id} AS uuid) 
          AND cm."removedAt" IS NULL
      ) unread_count ON true
      LEFT JOIN "ChatToUser" utc ON utc."chatId" = c."id" AND utc."userId" = CAST(${authenticatedUser.id} AS uuid)
      WHERE utc."userId" = CAST(${authenticatedUser.id} AS uuid)
      ${
        options?.where?.name?.startsWith
          ? Prisma.sql`AND c."name" ILIKE ${`${options.where.name.startsWith.toString()}%`}`
          : Prisma.empty
      }
      GROUP BY c."id", unread_count.total_unread
      ORDER BY COALESCE(MAX(cm."createdAt"), c."createdAt") DESC
      ${options?.take ? Prisma.sql`LIMIT ${options.take}` : Prisma.empty}
      ${options?.skip ? Prisma.sql`OFFSET ${options.skip}` : Prisma.empty}
    `;

    return chats;
  }

  public async create(data: CreateChatDto, files?: CreateChatUploadedFiles): Promise<ChatEntity> {
    const { chatsToUsers, ...chat } = data;

    return this.prismaService.chat
      .create({
        data: { ...chat, chatsToUsers: { createMany: { data: chatsToUsers || [] } } },
      })
      .then(chat => {
        if (files?.image?.length) {
          const image = files?.image[0];
          const filename = `${Routes.Chats}/${uuid()}${path.extname(image.originalname)}`;

          this.supabaseService.upload(image, filename).then(async response => {
            if (response.file.filename) {
              await this.prismaService.chat.update({
                where: { id: chat.id },
                data: { image: response.file.filename },
              });
            }
          });
        }

        return chat;
      });
  }

  public async update(
    id: string,
    data: UpdateChatDto,
    files?: UpdateChatUploadedFiles,
  ): Promise<ChatEntity> {
    const { image: imageInDto, ...dataWithoutImage } = data;

    return this.prismaService.chat
      .update({ where: { id }, data: dataWithoutImage })
      .then(async chat => {
        const image = files?.image?.[0];

        if (imageInDto === 'null') {
          await this.prismaService.chat.update({
            where: { id: chat.id },
            data: { image: null },
          });

          if (chat.image) {
            this.supabaseService.remove([chat.image]);
          }

          return chat;
        }

        if (image) {
          const filename = `${Routes.Chats}/${uuid()}${path.extname(image.originalname)}`;

          this.supabaseService.upload(image, filename).then(async response => {
            if (response.file.filename) {
              await this.prismaService.chat.update({
                where: { id: chat.id },
                data: { image: response.file.filename },
              });

              if (chat.image) {
                this.supabaseService.remove([chat.image]);
              }
            }
          });
        }

        return chat;
      });
  }

  public async remove(id: string): Promise<ChatEntity> {
    return this.prismaService.chat.delete({ where: { id } }).then(async chat => {
      if (chat.image) {
        this.supabaseService.remove([chat.image]);
      }

      return chat;
    });
  }
}
