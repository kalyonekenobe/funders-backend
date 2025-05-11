import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatMessage, ChatMessageStatuses } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { SocketEvents } from 'src/core/enums/socket-events.enum';
import { ChatService } from 'src/modules/chat/chat.service';
import { ChatMessageService } from 'src/modules/chat/submodules/chat-message/chat-message.service';
import { ChatToUserService } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.service';
import { configureCorsAllowedOriginsList } from 'src/modules/infrastructure/app/utils/app.utils';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: configureCorsAllowedOriginsList(process.env.CORS_ALLOWED_ORIGINS || ''),
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE, CONNECT',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly chatMessageService: ChatMessageService,
    private readonly chatToUserService: ChatToUserService,
    private readonly redisService: RedisService,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  public async handleConnection(client: Socket): Promise<void> {
    await this.redisService.deleteByPattern(`socket:${client.handshake.query.userId}:*`);
    await this.redisService.set(`socket:${client.handshake.query.userId}:${client.id}`, client.id);
    this.loggerService.log(`Client connected: ${client.id}`, ChatGateway.name);
  }

  public async handleDisconnect(client: Socket): Promise<void> {
    await this.redisService.deleteByPattern(`socket:${client.handshake.query.userId}:*`);
    this.loggerService.log(`Client disconnected: ${client.id}`, ChatGateway.name);
  }

  @SubscribeMessage(SocketEvents.CreateMessage)
  public async handleCreateMessage(_client: Socket, message: ChatMessage): Promise<void> {
    const users = await this.chatToUserService.findAllUsersForChat(message.chatId, {
      select: { user: true },
    });
    const chat = await this.chatService.findOne({ where: { id: message.chatId } });

    const redisPatterns = users.map(user => `socket:${user.id}:*`);
    const redisValues = await Promise.all(
      redisPatterns.map(pattern => this.redisService.getByPattern(pattern)),
    );
    const clientIds = redisValues.flat();

    clientIds.forEach(clientId => {
      this.server
        .to(clientId)
        .emit(SocketEvents.ReceiveCreatedMessage, { message: { ...message, chat } });
    });
  }

  @SubscribeMessage(SocketEvents.EditMessage)
  public async handleEditMessage(_client: Socket, message: ChatMessage): Promise<void> {
    this.server.in(message.chatId).emit(SocketEvents.ReceiveEditedMessage, { message });
  }

  @SubscribeMessage(SocketEvents.RemoveMessage)
  public async handleRemoveMessage(_client: Socket, message: ChatMessage): Promise<void> {
    this.server.in(message.chatId).emit(SocketEvents.ReceiveRemovedMessage, { message });
  }

  @SubscribeMessage(SocketEvents.PinMessage)
  public async handlePinMessage(_client: Socket, message: ChatMessage): Promise<void> {
    this.server.in(message.chatId).emit(SocketEvents.ReceivePinnedMessage, { message });
  }

  @SubscribeMessage(SocketEvents.ReadMessage)
  public async handleReadMessage(
    _client: Socket,
    data: { authenticatedUser: UserPublicEntity; message: ChatMessage },
  ): Promise<void> {
    try {
      const { authenticatedUser, message } = data;
      const userToChat = await this.chatToUserService.findOne(message.chatId, authenticatedUser.id);

      await Promise.all([
        this.chatToUserService.update(message.chatId, authenticatedUser.id, {
          lastSeenMessageTimestamp:
            new Date(message.updatedAt) > new Date(userToChat.lastSeenMessageTimestamp)
              ? new Date(message.updatedAt)
              : new Date(userToChat.lastSeenMessageTimestamp),
        }),
        this.chatMessageService.update(message.id, {
          status: ChatMessageStatuses.Read,
          ...(message.updatedAt &&
            new Date(message.updatedAt).getTime() === new Date(message.createdAt).getTime() && {
              updatedAt: message.createdAt,
            }),
        }),
      ]);
    } catch (error) {
      this.loggerService.error(error, error.stack, ChatGateway.name);
    }
  }

  @SubscribeMessage(SocketEvents.ReadMessages)
  public async handleReadMessages(
    _client: Socket,
    data: { authenticatedUser: UserPublicEntity; messages: ChatMessage[] },
  ): Promise<void> {
    try {
      const { authenticatedUser, messages } = data;

      if (messages.length > 0) {
        const userToChat = await this.chatToUserService.findOne(
          messages[0].chatId,
          authenticatedUser.id,
        );
        const latestMessageTimestamp = messages.reduce(
          (previousValue, currentValue) =>
            Math.max(previousValue, new Date(currentValue.updatedAt).getTime()),
          0,
        );

        await Promise.all([
          this.chatToUserService.update(messages[0].chatId, authenticatedUser.id, {
            lastSeenMessageTimestamp:
              new Date(latestMessageTimestamp) > new Date(userToChat.lastSeenMessageTimestamp)
                ? new Date(latestMessageTimestamp)
                : new Date(userToChat.lastSeenMessageTimestamp),
          }),
          Promise.all(
            messages.map(message =>
              this.chatMessageService.update(message.id, {
                status: ChatMessageStatuses.Read,
                ...(message.updatedAt &&
                  new Date(message.updatedAt).getTime() ===
                    new Date(message.createdAt).getTime() && {
                    updatedAt: message.createdAt,
                  }),
              }),
            ),
          ),
        ]);
      }
    } catch (error) {
      this.loggerService.error(error, error.stack, ChatGateway.name);
    }
  }

  @SubscribeMessage(SocketEvents.JoinChat)
  public async handleJoinChat(client: Socket, chatId: string): Promise<void> {
    client.join(chatId);
    this.loggerService.log(`Client ${client.id} connected the chat ${chatId}`, ChatGateway.name);
  }

  @SubscribeMessage(SocketEvents.JoinChats)
  public async handleJoinChats(client: Socket, chatIds: string[]): Promise<void> {
    chatIds.forEach(chatId => {
      client.join(chatId);
      this.loggerService.log(`Client ${client.id} connected the chat ${chatId}`, ChatGateway.name);
    });
  }
}
