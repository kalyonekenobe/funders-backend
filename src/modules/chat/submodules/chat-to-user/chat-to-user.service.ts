import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import { CreateChatToUserDto } from 'src/modules/chat/submodules/chat-to-user/DTO/create-chat-to-user.dto';
import { UpdateChatToUserDto } from 'src/modules/chat/submodules/chat-to-user/DTO/update-chat-to-user.dto';
import { ChatToUserEntity } from 'src/modules/chat/submodules/chat-to-user/entities/chat-to-user.entity';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@Injectable()
export class ChatToUserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllChatsForUser(
    userId: string,
    options?: Prisma.ChatToUserFindManyArgs,
  ): Promise<ChatEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.chatToUser
        .findMany(_.merge(options, { where: { userId }, select: { chat: true } }))
        .then(response => response.map(item => item.chat));
    });
  }

  public async findAllUsersForChat(
    chatId: string,
    options?: Prisma.ChatToUserFindManyArgs,
  ): Promise<UserPublicEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });

      return tx.chatToUser
        .findMany(
          _.merge(options, {
            where: { chatId },
            select: { user: { omit: { password: true, refreshToken: true } } },
          }),
        )
        .then(response => response.map(item => item.user));
    });
  }

  public async findOne(
    chatId: string,
    userId: string,
    options?: Prisma.ChatToUserFindFirstOrThrowArgs,
  ): Promise<ChatToUserEntity> {
    return this.prismaService.chatToUser.findFirstOrThrow(
      _.merge(options, {
        where: { chatId_userId: { chatId, userId } },
      }),
    );
  }

  public async create(chatId: string, data: CreateChatToUserDto): Promise<ChatToUserEntity> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });

      return tx.chatToUser.create({ data: { ...data, chatId } });
    });
  }

  public async update(
    chatId: string,
    userId: string,
    data: UpdateChatToUserDto,
  ): Promise<ChatToUserEntity> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.chatToUser.update({ where: { chatId_userId: { chatId, userId } }, data });
    });
  }

  public async remove(chatId: string, userId: string): Promise<ChatToUserEntity> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.chatToUser.delete({ where: { chatId_userId: { chatId, userId } } });
    });
  }
}
