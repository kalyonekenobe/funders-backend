import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { ChatService } from 'src/modules/chat/chat.service';
import { ChatMessageService } from 'src/modules/chat/submodules/chat-message/chat-message.service';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Permissions, UpdateUserUploadedFiles } from 'src/modules/user/types/user.types';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import { CreateChatDto } from 'src/modules/chat/DTO/create-chat.dto';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { CreateChatUploadedFiles } from 'src/modules/chat/types/chat.types';
import { UpdateChatDto } from 'src/modules/chat/DTO/update-chat.dto';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { CreateChatMessageDto } from 'src/modules/chat/submodules/chat-message/DTO/create-chat-message.dto';
import { CreateChatMessageUploadedFiles } from 'src/modules/chat/submodules/chat-message/types/chat-message.types';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import * as _ from 'lodash';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@ApiTags(RoutesApiTags[Routes.Chats])
@Controller(Routes.Chats)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChats })
  @ApiCreatedResponse({ description: 'Chat was successfully created.', type: ChatEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create chat. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post()
  public async create(
    @Body() createChatDto: CreateChatDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'image', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 }])
    files: CreateChatUploadedFiles,
  ): Promise<ChatEntity> {
    return this.chatService.create(createChatDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiCreatedResponse({
    description: 'Chat message was successfully created.',
    type: ChatMessageEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot create chat message. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/messages')
  public async createMessage(
    @Param('id') id: string,
    @Body() createChatMessageDto: CreateChatMessageDto,
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: CreateChatMessageUploadedFiles,
  ): Promise<ChatMessageEntity> {
    return this.chatMessageService.create(
      { ...createChatMessageDto, chatId: id, authorId: authenticatedUser.id },
      files,
    );
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The list of chat messages', type: [ChatMessageEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/messages')
  public async findAllChatMessages(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<ChatMessageEntity[]> {
    return this.chatMessageService.findAllForChat(id, deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The list of chats', type: [ChatEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<ChatEntity[]> {
    return this.chatService.findAll(deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of chats for the authenticated user',
    type: [ChatEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get('list')
  public async getChatListForUser(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Query() query?: Record<string, string>,
  ): Promise<ChatEntity[]> {
    return this.chatService.getChatListForUser(authenticatedUser, deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The chat with requested id', type: ChatEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<ChatEntity> {
    return this.chatService.findOne(_.merge(deserializeQueryString(query), { where: { id } }));
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChats })
  @ApiOkResponse({ description: 'Chat was successfully updated.', type: ChatEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update chat. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'image', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 }])
    files: UpdateUserUploadedFiles,
  ): Promise<ChatEntity> {
    return this.chatService.update(id, updateChatDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChats })
  @ApiOkResponse({ description: 'Chat was successfully removed.', type: ChatEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the chat to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<ChatEntity> {
    return this.chatService.remove(id);
  }
}
