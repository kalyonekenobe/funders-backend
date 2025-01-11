import {
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { FollowingEntity } from 'src/modules/user/submodules/following/entities/following.entity';
import { FollowingService } from 'src/modules/user/submodules/following/following.service';

@ApiTags(RoutesApiTags[Routes.Users])
@Controller(Routes.Users)
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @ApiOkResponse({ description: 'The list of user followings.', type: [UserPublicEntity] })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/followings')
  public async findAllUserFollowings(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserPublicEntity[]> {
    return this.followingService.findAllUserFollowings(id, deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The list of user followers.', type: [UserPublicEntity] })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/followers')
  public async findAllUserFollowers(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserPublicEntity[]> {
    return this.followingService.findAllUserFollowers(id, deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({ description: 'Following was successfully created.', type: FollowingEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The following with the requested userId and followerId was not found.',
  })
  @ApiConflictResponse({ description: 'Cannot create the following. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to be followed',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'followerId',
    description: 'The id of the follower who wants to follow the user with userId',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Post(':userId/followers/:followerId')
  public async create(
    @Param('userId') userId: string,
    @Param('followerId') followerId: string,
  ): Promise<FollowingEntity> {
    if (userId === followerId) {
      throw new ConflictException({
        message: 'The user cannot follow himself.',
        error: 'The user cannot follow himself.',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    return this.followingService.create({ userId, followerId });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'Following was successfully removed.', type: FollowingEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The following with the requested userId and followerId was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to be unfollowed',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'followerId',
    description: 'The id of the follower who wants to unfollow the user with userId',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Delete(':userId/followers/:followerId')
  public async remove(
    @Param('userId') userId: string,
    @Param('followerId') followerId: string,
  ): Promise<FollowingEntity> {
    return this.followingService.remove(userId, followerId);
  }
}
