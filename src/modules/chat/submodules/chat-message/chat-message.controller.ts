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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import * as _ from 'lodash';
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChatMessageService } from 'src/modules/chat/submodules/chat-message/chat-message.service';
import { CreateChatMessageDto } from 'src/modules/chat/submodules/chat-message/DTO/create-chat-message.dto';
import { UpdateChatMessageDto } from 'src/modules/chat/submodules/chat-message/DTO/update-chat-message.dto';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { ChatMessageAttachmentService } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/chat-message-attachment.service';
import { ChatMessageAttachmentEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/entities/chat-message-attachment.entity';
import {
  CreateChatMessageUploadedFiles,
  UpdateChatMessageUploadedFiles,
} from 'src/modules/chat/submodules/chat-message/types/chat-message.types';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.ChatMessages])
@Controller(Routes.ChatMessages)
export class ChatMessageController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly chatMessageAttachmentService: ChatMessageAttachmentService,
  ) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The list of chat messages', type: [ChatMessageEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  public async findAll(@Query() query: Record<string, string>): Promise<ChatMessageEntity[]> {
    return this.chatMessageService.findAll(deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The chat message with requested id', type: ChatMessageEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat message with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: string,
    @Query() query: Record<string, string>,
  ): Promise<ChatMessageEntity> {
    return this.chatMessageService.findOne(
      _.merge(deserializeQueryString(query), { where: { id } }),
    );
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of chat message attachments',
    type: [ChatMessageAttachmentEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat message with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/attachments')
  public async findAllChatMessageAttachments(
    @Param('id') id: string,
    @Query() query: Record<string, string>,
  ): Promise<ChatMessageAttachmentEntity[]> {
    return this.chatMessageAttachmentService.findAllForChatMessage(
      id,
      deserializeQueryString(query),
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiCreatedResponse({
    description: 'Chat message was successfully created.',
    type: ChatMessageEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create chat message. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @Post()
  public async createMessage(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: CreateChatMessageUploadedFiles,
  ): Promise<ChatMessageEntity> {
    return this.chatMessageService.create(
      { ...createChatMessageDto, authorId: authenticatedUser.id },
      files,
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiOkResponse({ description: 'Chat message was successfully updated.', type: ChatMessageEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat message with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update chat message. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: UpdateChatMessageUploadedFiles,
  ): Promise<ChatMessageEntity> {
    return this.chatMessageService.update(id, updateChatMessageDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiOkResponse({ description: 'Chat message was successfully removed.', type: ChatMessageEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat message with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the chat message to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<ChatMessageEntity> {
    return this.chatMessageService.remove(id);
  }
}
