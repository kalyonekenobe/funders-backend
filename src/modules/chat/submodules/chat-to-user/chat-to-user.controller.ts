import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChatToUserService } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.service';
import { CreateChatToUserDto } from 'src/modules/chat/submodules/chat-to-user/DTO/create-chat-to-user.dto';
import { UpdateChatToUserDto } from 'src/modules/chat/submodules/chat-to-user/DTO/update-chat-to-user.dto';
import { ChatToUserEntity } from 'src/modules/chat/submodules/chat-to-user/entities/chat-to-user.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.ChatToUser])
@Controller(Routes.ChatToUser)
export class ChatToUserController {
  constructor(private readonly chatToUserService: ChatToUserService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The list of users of the chat', type: [UserPublicEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'Cannot find chat with the specified id.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to find the users',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get()
  public async findAllUsersForChat(
    @Param('chatId') chatId: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserPublicEntity[]> {
    return this.chatToUserService.findAllUsersForChat(chatId, deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The chats on users entity', type: ChatToUserEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'Cannot find chat with the specified id.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to find the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to find the user in chat',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Get(':userId')
  public async findById(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Query() query?: Record<string, string>,
  ): Promise<ChatToUserEntity> {
    return this.chatToUserService.findOne(chatId, userId, deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChats })
  @ApiCreatedResponse({
    description: 'The user was successfully added to the chat.',
    type: ChatToUserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot add the user to the chat. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to add the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post()
  public async create(
    @Param('chatId') chatId: string,
    @Body()
    createChatToUserDto: CreateChatToUserDto,
  ): Promise<ChatToUserEntity> {
    return this.chatToUserService.create(chatId, createChatToUserDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChats })
  @ApiOkResponse({
    description: 'The user of the chat was successfully updated.',
    type: ChatToUserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat or the user with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot update the user of the chat. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to update the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to update the user in chat',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Put(':userId')
  public async update(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Body()
    updateChatToUserDto: UpdateChatToUserDto,
  ): Promise<ChatToUserEntity> {
    return this.chatToUserService.update(chatId, userId, updateChatToUserDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageChats })
  @ApiOkResponse({
    description: 'The user of the chat was successfully removed.',
    type: ChatToUserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat or the user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'chatId',
    description: 'The id of the chat to delete the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to delete the user in chat',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Delete(':userId')
  public async remove(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ): Promise<ChatToUserEntity> {
    return this.chatToUserService.remove(chatId, userId);
  }
}
