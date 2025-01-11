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
import { CreateUserRoleDto } from 'src/modules/user/submodules/user-role/DTO/create-user-role.dto';
import { UpdateUserRoleDto } from 'src/modules/user/submodules/user-role/DTO/update-user-role.dto';
import { UserRoleEntity } from 'src/modules/user/submodules/user-role/entities/user-role.entity';
import { UserRoleService } from 'src/modules/user/submodules/user-role/user-role.service';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.UserRoles])
@Controller(Routes.UserRoles)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ApiOkResponse({ description: 'The list of user roles', type: [UserRoleEntity] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query: Record<string, string>): Promise<UserRoleEntity[]> {
    return this.userRoleService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The user role', type: UserRoleEntity })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be found',
    schema: { example: 'Administrator' },
  })
  @Get(':name')
  public async findOne(
    @Param('name') name: string,
    @Query() query: Record<string, string>,
  ): Promise<UserRoleEntity> {
    return this.userRoleService.findOne(
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
  @ApiCreatedResponse({ description: 'User role was successfully created.', type: UserRoleEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create user role. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post()
  public async create(@Body() createUserRoleDto: CreateUserRoleDto): Promise<UserRoleEntity> {
    return this.userRoleService.create(createUserRoleDto);
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
  @ApiOkResponse({ description: 'User role was successfully updated.', type: UserRoleEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user role with the requested name was not found.' })
  @ApiConflictResponse({ description: 'Cannot update user role. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be updated',
    schema: { example: 'Administrator' },
  })
  @Put(':name')
  public async update(
    @Param('name') name: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserRoleEntity> {
    return this.userRoleService.update(name, updateUserRoleDto);
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
  @ApiOkResponse({ description: 'User role was successfully removed.', type: UserRoleEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user role with the requested name was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be deleted',
    schema: { example: 'Administrator' },
  })
  @Delete(':name')
  public async remove(@Param('name') name: string): Promise<UserRoleEntity> {
    return this.userRoleService.remove(name);
  }
}
