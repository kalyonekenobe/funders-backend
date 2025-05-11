import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { CountResponse, ObjectKeysCountResponse } from 'src/modules/utils/types/utils.types';

@Injectable()
export class UtilsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async countUsers(options?: Prisma.UserCountArgs): Promise<CountResponse> {
    if (options) {
      const count = await this.prismaService.user.count(options);

      return { count };
    }

    const count = await this.prismaService.user.count();

    return { count };
  }

  public async countUnreadMessagesInChats(
    authenticatedUser: UserPublicEntity,
    options?: Prisma.ChatMessageCountArgs,
  ): Promise<ObjectKeysCountResponse> {
    const chatsWhereUserIsMember = await this.prismaService.chat.findMany({
      where: { chatsToUsers: { some: { userId: authenticatedUser.id } } },
      select: {
        id: true,
        chatsToUsers: {
          where: { userId: authenticatedUser.id },
          select: { lastSeenMessageTimestamp: true },
        },
      },
    });

    const result: ObjectKeysCountResponse = {};

    for (let chat of chatsWhereUserIsMember) {
      result[chat.id] = {
        count: await this.prismaService.chatMessage.count(
          _.merge(options, {
            where: {
              chatId: chat.id,
              authorId: { not: authenticatedUser.id },
              createdAt: { gt: chat.chatsToUsers[0].lastSeenMessageTimestamp },
            },
          }),
        ),
      };
    }

    return result;
  }
}
