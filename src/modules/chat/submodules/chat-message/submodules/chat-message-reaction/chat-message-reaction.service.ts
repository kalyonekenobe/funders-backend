import { Injectable } from '@nestjs/common';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { CreateChatMessageReactionDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/DTO/create-chat-message-reaction.dto';
import { UpdateChatMessageReactionDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/DTO/update-chat-message-reaction.dto';
import { ChatMessageReactionEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/entities/chat-message-reaction.entity';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@Injectable()
export class ChatMessageReactionService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllForChatMessage(
    messageId: ChatMessageEntity['id'],
  ): Promise<ChatMessageReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chatMessage.findUniqueOrThrow({ where: { id: messageId } });
      return tx.chatMessageReaction.findMany({ where: { messageId } });
    });
  }

  public async findAllForUser(
    userId: UserPublicEntity['id'],
  ): Promise<ChatMessageReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return tx.chatMessageReaction.findMany({ where: { userId } });
    });
  }

  public async create(data: CreateChatMessageReactionDto): Promise<ChatMessageReactionEntity> {
    return this.prismaService.chatMessageReaction.create({
      data: { ...data, userId: data.userId || '', messageId: data.messageId || '' },
    });
  }

  public async update(
    messageId: ChatMessageEntity['id'],
    userId: UserPublicEntity['id'],
    data: UpdateChatMessageReactionDto,
  ): Promise<ChatMessageReactionEntity> {
    return this.prismaService.chatMessageReaction.update({
      where: { messageId_userId: { messageId, userId } },
      data,
    });
  }

  public async remove(
    messageId: ChatMessageEntity['id'],
    userId: UserPublicEntity['id'],
  ): Promise<ChatMessageReactionEntity> {
    return this.prismaService.chatMessageReaction.delete({
      where: { messageId_userId: { userId, messageId } },
    });
  }
}
