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
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { CreatePostReactionDto } from 'src/modules/post/submodules/post-reaction/DTO/create-post-reaction.dto';
import { UpdatePostReactionDto } from 'src/modules/post/submodules/post-reaction/DTO/update-post-reaction.dto';
import { PostReactionEntity } from 'src/modules/post/submodules/post-reaction/entities/post-reaction.entity';
import { PostReactionService } from 'src/modules/post/submodules/post-reaction/post-reaction.service';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@ApiTags(RoutesApiTags[Routes.PostReactions])
@Controller(Routes.Posts)
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @ApiOkResponse({ description: 'The list of post reactions', type: [PostReactionEntity] })
  @ApiNotFoundResponse({ description: 'The post with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/reactions')
  public async findAllPostReactions(
    @Param('id') id: PostEntity['id'],
  ): Promise<PostReactionEntity[]> {
    return this.postReactionService.findAllForPost(id);
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Post reaction was successfully created.',
    type: PostReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot create post reaction. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/reactions')
  public async create(
    @Param('id') id: PostEntity['id'],
    @Body() createPostReactionDto: CreatePostReactionDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<PostReactionEntity> {
    return this.postReactionService.create({
      ...createPostReactionDto,
      postId: id,
      userId: user.id,
    });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post reaction was successfully updated.',
    type: PostReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post and user with the requested ids were not found.' })
  @ApiConflictResponse({ description: 'Cannot update post reaction. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put(':id/reactions')
  public async update(
    @Param('id') postId: PostEntity['id'],
    @Body() updatePostReactionDto: UpdatePostReactionDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<PostReactionEntity> {
    return this.postReactionService.update(postId, user.id, updatePostReactionDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post reaction was successfully removed.',
    type: PostReactionEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post and user with the requested ids were not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id/reactions')
  public async remove(
    @Param('id') postId: PostEntity['id'],
    @AuthenticatedUser() user: UserPublicEntity,
  ) {
    return this.postReactionService.remove(postId, user.id);
  }
}
