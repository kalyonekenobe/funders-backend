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
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChatMessageAttachmentService } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/chat-message-attachment.service';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { ChatMessageAttachmentEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/entities/chat-message-attachment.entity';
import * as _ from 'lodash';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { Permissions } from 'src/modules/user/types/user.types';
import { UpdateChatMessageAttachmentDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/DTO/update-chat-message-attachment.dto';
import {
  CreateChatMessageAttachmentUploadedFiles,
  UpdateChatMessageAttachmentUploadedFiles,
} from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/types/chat-message-attachment.types';
import { CreateChatMessageAttachmentDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/DTO/create-chat-message-attachment.dto';

@ApiTags(RoutesApiTags[Routes.ChatMessageAttachments])
@Controller(Routes.ChatMessageAttachments)
export class ChatMessageAttachmentController {
  constructor(private readonly chatMessageAttachmentService: ChatMessageAttachmentService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of chat message attachments',
    type: [ChatMessageAttachmentEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(
    @Query() query?: Record<string, string>,
  ): Promise<ChatMessageAttachmentEntity[]> {
    return this.chatMessageAttachmentService.findAll(deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The chat message attachment with requested id',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The chat message attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message attachment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<ChatMessageAttachmentEntity> {
    return this.chatMessageAttachmentService.findOne(
      _.merge(deserializeQueryString(query), { where: { id } }),
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiCreatedResponse({
    description: 'Chat message attachment was successfully created.',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: 'Cannot create chat message attachment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'location', maxCount: 1 }]))
  @Post()
  public async create(
    @Body() createChatMessageAttachmentDto: CreateChatMessageAttachmentDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'location', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 }])
    files: CreateChatMessageAttachmentUploadedFiles,
  ): Promise<ChatMessageAttachmentEntity> {
    return this.chatMessageAttachmentService.create(createChatMessageAttachmentDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiOkResponse({
    description: 'Chat message attachment was successfully updated.',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The chat message attachment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update chat message attachment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message attachment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'location', maxCount: 1 }]))
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateChatMessageAttachmentDto: UpdateChatMessageAttachmentDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'location', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 }])
    files: UpdateChatMessageAttachmentUploadedFiles,
  ): Promise<ChatMessageAttachmentEntity> {
    return this.chatMessageAttachmentService.update(id, updateChatMessageAttachmentDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChatMessages })
  @ApiOkResponse({
    description: 'Chat message attachment was successfully removed.',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The chat message attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the chat message attachment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<ChatMessageAttachmentEntity> {
    return this.chatMessageAttachmentService.remove(id);
  }
}
