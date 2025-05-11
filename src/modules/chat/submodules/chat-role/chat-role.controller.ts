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
import * as _ from 'lodash';
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChatRoleService } from 'src/modules/chat/submodules/chat-role/chat-role.service';
import { CreateChatRoleDto } from 'src/modules/chat/submodules/chat-role/DTO/create-chat-role.dto';
import { UpdateChatRoleDto } from 'src/modules/chat/submodules/chat-role/DTO/update-chat-role.dto';
import { ChatRoleEntity } from 'src/modules/chat/submodules/chat-role/entities/chat-role.entity';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.ChatRoles])
@Controller(Routes.ChatRoles)
export class ChatRoleController {
  constructor(private readonly chatRoleService: ChatRoleService) {}

  @ApiOkResponse({ description: 'The list of chat roles', type: [ChatRoleEntity] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<ChatRoleEntity[]> {
    return this.chatRoleService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The chat role with the requested name.', type: ChatRoleEntity })
  @ApiNotFoundResponse({ description: 'The chat role with the requested name was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be found.',
    schema: { example: 'Moderator' },
  })
  @Get(':name')
  public async findByName(
    @Param('name') name: ChatRoleEntity['name'],
    @Query() query?: Record<string, string>,
  ): Promise<ChatRoleEntity> {
    return this.chatRoleService.findOne(
      _.merge(deserializeQueryString(query), { where: { name } }),
    );
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.ManagePostComments |
      Permissions.ManageChats |
      Permissions.ManageChatMessages |
      Permissions.ManagePosts |
      Permissions.ManagePostCategories |
      Permissions.ManageUsers |
      Permissions.ManageUserBans,
  })
  @ApiCreatedResponse({ description: 'Chat role was successfully created.', type: ChatRoleEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create chat role. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post()
  public async create(@Body() createChatRoleDto: CreateChatRoleDto): Promise<ChatRoleEntity> {
    return this.chatRoleService.create(createChatRoleDto);
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.ManagePostComments |
      Permissions.ManageChats |
      Permissions.ManageChatMessages |
      Permissions.ManagePosts |
      Permissions.ManagePostCategories |
      Permissions.ManageUsers |
      Permissions.ManageUserBans,
  })
  @ApiOkResponse({ description: 'Chat role was successfully updated.', type: ChatRoleEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat role with requested name was not found.' })
  @ApiConflictResponse({ description: 'Cannot update chat role. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be updated',
    schema: { example: 'User' },
  })
  @Put(':name')
  public async update(
    @Param('name') name: ChatRoleEntity['name'],
    @Body() updateChatRoleDto: UpdateChatRoleDto,
  ): Promise<ChatRoleEntity> {
    return this.chatRoleService.update(name, updateChatRoleDto);
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.ManagePostComments |
      Permissions.ManageChats |
      Permissions.ManageChatMessages |
      Permissions.ManagePosts |
      Permissions.ManagePostCategories |
      Permissions.ManageUsers |
      Permissions.ManageUserBans,
  })
  @ApiOkResponse({ description: 'Chat role was successfully removed.', type: ChatRoleEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The chat role with requested name was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be deleted',
    schema: { example: 'User' },
  })
  @Delete(':name')
  public async remove(@Param('name') name: ChatRoleEntity['name']): Promise<ChatRoleEntity> {
    return this.chatRoleService.remove(name);
  }
}
