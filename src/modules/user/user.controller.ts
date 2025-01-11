import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
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
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Auth } from 'src/core/decorators/auth.decorator';
import { UserService } from 'src/modules/user/user.service';
import { UserPenaltyService } from 'src/modules/user/submodules/user-penalty/user-penalty.service';
import { PostService } from 'src/modules/post/post.service';
import { PostReactionService } from 'src/modules/post/submodules/post-reaction/post-reaction.service';
import { PostCommentService } from 'src/modules/post/submodules/post-comment/post-comment.service';
import { PostCommentReactionService } from 'src/modules/post/submodules/post-comment/submodules/post-comment-reaction/post-comment-reaction.service';
import { ChatsOnUsersService } from 'src/modules/chat/submodules/chats-on-users/chats-on-users.service';
import {
  CreateUserUploadedFiles,
  Permissions,
  UpdateUserUploadedFiles,
} from 'src/modules/user/types/user.types';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { CreateUserDto } from 'src/modules/user/DTO/create-user.dto';
import { UserPenaltyEntity } from 'src/modules/user/submodules/user-penalty/entities/user-penalty.entity';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { PostReactionEntity } from 'src/modules/post/submodules/post-reaction/entities/post-reaction.entity';
import { PostCommentReactionEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-reaction/entities/post-comment-reaction.entity';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import * as _ from 'lodash';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { UpdateUserDto } from 'src/modules/user/DTO/update-user.dto';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { CreateUserPenaltyDto } from 'src/modules/user/submodules/user-penalty/DTO/create-user-penalty.dto';
import { UserReportService } from 'src/modules/user/submodules/user-report/user-report.service';
import { UserReportEntity } from 'src/modules/user/submodules/user-report/entities/user-report.entity';
import { CreateUserReportDto } from 'src/modules/user/submodules/user-report/DTO/create-user-report.dto';

@ApiTags(RoutesApiTags[Routes.Users])
@Controller(Routes.Users)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPenaltyService: UserPenaltyService,
    private readonly userReportService: UserReportService,
    private readonly postService: PostService,
    private readonly postReactionService: PostReactionService,
    private readonly postCommentService: PostCommentService,
    private readonly postCommentReactionService: PostCommentReactionService,
    private readonly chatsOnUsersService: ChatsOnUsersService,
  ) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageUsers })
  @ApiCreatedResponse({ description: 'User was successfully created.', type: UserPublicEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create user. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'image', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 }])
    files: CreateUserUploadedFiles,
  ): Promise<UserPublicEntity> {
    return this.userService.create(createUserDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManageUserBans })
  @ApiCreatedResponse({
    description: 'User penalty was successfully created.',
    type: UserPenaltyEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: 'Cannot create user penalty. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user which should be banned',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Post(':id/penalties')
  public async createUserPenalty(
    @Param('id') userId: string,
    @Body() createUserPenaltyDto: CreateUserPenaltyDto,
  ): Promise<UserPenaltyEntity> {
    return this.userPenaltyService.create({ ...createUserPenaltyDto, userId });
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'User report was successfully created.',
    type: UserReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: 'Cannot create user report. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user who is the reporter',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Post(':id/reports')
  public async createUserReport(
    @AuthenticatedUser() authenticatedUser: UserPenaltyEntity,
    @Param('id') reporterId: string,
    @Body() createUserReportDto: CreateUserReportDto,
  ): Promise<UserReportEntity> {
    if (authenticatedUser.id !== reporterId) {
      throw new ForbiddenException(
        'You are forbidden to perform this action. The authenticated user id is different from the reporter user id.',
      );
    }

    return this.userReportService.create({ ...createUserReportDto, reporterId });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The list of user incoming reports', type: [UserReportEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user for whom to show the list of incoming reports',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/reports/incoming')
  public async findAllUserIncomingReports(
    @Param('id') userId: string,
    @Query() query: Record<string, string>,
  ): Promise<UserReportEntity[]> {
    return this.userReportService.findAll(
      _.merge(deserializeQueryString(query), { where: { userId } }),
    );
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The list of user outcoming reports', type: [UserReportEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user for whom to show the list of outcoming reports',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/reports/outcoming')
  public async findAllUserOutcomingReports(
    @Param('id') reporterId: string,
    @Query() query: Record<string, string>,
  ): Promise<UserReportEntity[]> {
    return this.userReportService.findAll(
      _.merge(deserializeQueryString(query), { where: { reporterId } }),
    );
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: "The list of user's penalties", type: [UserPenaltyEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of user penalties',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/penalties')
  public async findAllUserBans(
    @Param('id') userId: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserPenaltyEntity[]> {
    return this.userPenaltyService.findAllUserBans(userId, deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: "The list of user's post reactions", type: [PostReactionEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of post reactions',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/post-reactions')
  public async findAllUserPostReactions(
    @Param('id') userId: string,
  ): Promise<PostReactionEntity[]> {
    return this.postReactionService.findAllForUser(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: "The list of user's post comment reactions",
    type: [PostCommentReactionEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of post comment reactions',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/comment-reactions')
  public async findAllUserPostCommentReactions(
    @Param('id') userId: string,
  ): Promise<PostCommentReactionEntity[]> {
    return this.postCommentReactionService.findAllForUser(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: "The list of user's chats", type: [ChatEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of chats',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/chats')
  public async findAllUserChats(@Param('id') userId: string): Promise<ChatEntity[]> {
    return this.chatsOnUsersService.findAllChatsForUser(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: "The list of user's post comments", type: [PostCommentEntity] })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of post comments',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/comments')
  public async findAllUserComments(@Param('id') userId: string): Promise<PostCommentEntity[]> {
    return this.postCommentService.findAllForUser(userId);
  }

  @ApiOkResponse({ description: 'The list of users', type: [UserPublicEntity] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<UserPublicEntity[]> {
    return this.userService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The user with requested id.', type: UserPublicEntity })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be found.',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserPublicEntity> {
    return this.userService.findOne(_.merge(deserializeQueryString(query), { where: { id } }));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of posts of the user with requested id',
    type: [PostEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to find all his posts',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/posts')
  public async findAllUserPosts(@Param('id') id: string): Promise<PostEntity[]> {
    return this.postService.findAllUserPosts(id);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'User was successfully updated.', type: UserPublicEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update user. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Put(':id')
  public async update(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'image', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 }])
    files: UpdateUserUploadedFiles,
  ): Promise<UserPublicEntity> {
    if (
      id !== authenticatedUser.id &&
      ((Number(authenticatedUser.userRole?.permissions) || 0) & Permissions.ManageUsers) !==
        Permissions.ManageUsers
    ) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'The user is forbidden to perform this action.',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    return this.userService.update(id, updateUserDto, files);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'User was successfully removed.', type: UserPublicEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  public async remove(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Param('id') id: string,
  ): Promise<UserPublicEntity> {
    if (
      id !== authenticatedUser.id &&
      ((Number(authenticatedUser.userRole?.permissions) || 0) & Permissions.ManageUsers) !==
        Permissions.ManageUsers
    ) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'The user is forbidden to perform this action.',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    return this.userService.remove(id);
  }
}
