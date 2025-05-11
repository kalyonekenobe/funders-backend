import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import {
  ApiConflictResponse,
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
import { Permissions } from 'src/modules/user/types/user.types';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import * as _ from 'lodash';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { UserPenaltyService } from 'src/modules/user/submodules/user-penalty/user-penalty.service';
import { UserPenaltyEntity } from 'src/modules/user/submodules/user-penalty/entities/user-penalty.entity';
import { UpdateUserPenaltyDto } from 'src/modules/user/submodules/user-penalty/DTO/update-user-penalty.dto';

@ApiTags(RoutesApiTags[Routes.UserPenalties])
@Controller(Routes.UserPenalties)
export class UserPenaltyController {
  constructor(private readonly userPenaltyService: UserPenaltyService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of user penalties',
    type: [UserPenaltyEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<UserPenaltyEntity[]> {
    return this.userPenaltyService.findAll(deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The user penalty with requested id',
    type: UserPenaltyEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The user penalty with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the users penalty to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserPenaltyEntity> {
    return this.userPenaltyService.findOne(
      _.merge(deserializeQueryString(query), { where: { id } }),
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageUserBans })
  @ApiOkResponse({
    description: 'User penalty was successfully updated.',
    type: UserPenaltyEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The user penalty with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update user penalty. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserPenaltyDto: UpdateUserPenaltyDto,
  ): Promise<UserPenaltyEntity> {
    return this.userPenaltyService.update(id, updateUserPenaltyDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageUserBans })
  @ApiOkResponse({
    description: 'User penalty was successfully removed.',
    type: UserPenaltyEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The user penalty with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user penalty to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<UserPenaltyEntity> {
    return this.userPenaltyService.remove(id);
  }
}
