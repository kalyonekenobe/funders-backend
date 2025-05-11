import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { ChatMessageReactionService } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/chat-message-reaction.service';
import { ChatMessageReactionEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/entities/chat-message-reaction.entity';
import { CreateChatMessageReactionDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/DTO/create-chat-message-reaction.dto';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { UpdateChatMessageReactionDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/DTO/update-chat-message-reaction.dto';

@ApiTags(RoutesApiTags[Routes.ChatMessageAttachments])
@Controller(Routes.ChatMessages)
export class ChatMessageReactionController {
  constructor(private readonly chatMessageReactionService: ChatMessageReactionService) {}

  @ApiOkResponse({
    description: 'The list of chat message reactions',
    type: [ChatMessageReactionEntity],
  })
  @ApiNotFoundResponse({ description: 'The chat message with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/reactions')
  public async findAllChatMessageReactions(
    @Param('id') id: string,
  ): Promise<ChatMessageReactionEntity[]> {
    return this.chatMessageReactionService.findAllForChatMessage(id);
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Chat message reaction was successfully created.',
    type: ChatMessageReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat message with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot create chat message reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/reactions')
  public async create(
    @Param('id') id: string,
    @Body() createChatMessageReactionDto: CreateChatMessageReactionDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<ChatMessageReactionEntity> {
    return this.chatMessageReactionService.create({
      ...createChatMessageReactionDto,
      messageId: id,
      userId: user.id,
    });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Chat message reaction was successfully updated.',
    type: ChatMessageReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The chat message and user with the requested ids were not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update chat message reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put(':id/reactions')
  public async update(
    @Param('id') messageId: string,
    @Body() updateChatMessageReactionDto: UpdateChatMessageReactionDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<ChatMessageReactionEntity> {
    return this.chatMessageReactionService.update(messageId, user.id, updateChatMessageReactionDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Chat message reaction was successfully removed.',
    type: ChatMessageReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The chat message and user with the requested ids were not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id/reactions')
  public async remove(
    @Param('id') messageId: string,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<ChatMessageReactionEntity> {
    return this.chatMessageReactionService.remove(messageId, user.id);
  }
}
