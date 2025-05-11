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
import { PostCommentReactionService } from './post-comment-reaction.service';
import { PostCommentReactionEntity } from './entities/post-comment-reaction.entity';
import { CreatePostCommentReactionDto } from './DTO/create-post-comment-reaction.dto';
import { UpdatePostCommentReactionDto } from './DTO/update-post-comment-reaction.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { RoutesApiTags } from 'src/core/constants';

@ApiTags(RoutesApiTags[Routes.PostCommentReactions])
@Controller(Routes.PostComments)
export class PostCommentReactionController {
  constructor(private readonly postCommentReactionService: PostCommentReactionService) {}

  @ApiOkResponse({
    description: 'The list of post comment reactions',
    type: [PostCommentReactionEntity],
  })
  @ApiNotFoundResponse({ description: 'The post comment with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/reactions')
  public async findAllPostCommentReactions(
    @Param('id') id: PostCommentEntity['id'],
  ): Promise<PostCommentReactionEntity[]> {
    return this.postCommentReactionService.findAllForComment(id);
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Post comment reaction was successfully created.',
    type: PostCommentReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post comment with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot create post comment reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/reactions')
  public async create(
    @Param('id') id: PostCommentEntity['id'],
    @Body() createPostCommentReactionDto: CreatePostCommentReactionDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<PostCommentReactionEntity> {
    return this.postCommentReactionService.create({
      ...createPostCommentReactionDto,
      commentId: id,
      userId: user.id,
    });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post comment reaction was successfully updated.',
    type: PostCommentReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post comment and user with the requested ids were not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post comment reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put(':id/reactions')
  public async update(
    @Param('id') commentId: PostCommentEntity['id'],
    @Body() updatePostCommentReactionDto: UpdatePostCommentReactionDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<PostCommentReactionEntity> {
    return this.postCommentReactionService.update(commentId, user.id, updatePostCommentReactionDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post comment reaction was successfully removed.',
    type: PostCommentReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post comment and user with the requested ids were not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id/reactions')
  public async remove(
    @Param('id') commentId: PostCommentEntity['id'],
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<PostCommentReactionEntity> {
    return this.postCommentReactionService.remove(commentId, user.id);
  }
}
