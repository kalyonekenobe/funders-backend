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
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { PostService } from 'src/modules/post/post.service';
import { PostDonationService } from 'src/modules/post/submodules/post-donation/post-donation.service';
import { PostAttachmentService } from 'src/modules/post/submodules/post-attachment/post-attachment.service';
import { PostCommentService } from 'src/modules/post/submodules/post-comment/post-comment.service';
import { Permissions } from 'src/modules/user/types/user.types';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  CreatePostUploadedFiles,
  UpdatePostUploadedFiles,
} from 'src/modules/post/types/post.types';
import { CreatePostDto } from 'src/modules/post/DTO/create-post.dto';
import { UpdatePostDto } from 'src/modules/post/DTO/update-post.dto';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { PostDonationEntity } from 'src/modules/post/submodules/post-donation/entities/post-donation.entity';
import { PostAttachmentEntity } from 'src/modules/post/submodules/post-attachment/entities/post-attachment.entity';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { CreatePostDonationDto } from 'src/modules/post/submodules/post-donation/DTO/create-post-donation.dto';
import { CreatePostCommentDto } from 'src/modules/post/submodules/post-comment/DTO/create-post-comment.dto';
import { CreatePostCommentUploadedFiles } from 'src/modules/post/submodules/post-comment/types/post-comment.types';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@ApiTags(RoutesApiTags[Routes.Posts])
@Controller(Routes.Posts)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postDonationService: PostDonationService,
    private readonly postAttachmentService: PostAttachmentService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePosts })
  @ApiCreatedResponse({ description: 'Post was successfully created.', type: PostEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create post. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }, { name: 'image', maxCount: 1 }]))
  @Post()
  public async create(
    @AuthenticatedUser() user: UserPublicEntity,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'image', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 },
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: CreatePostUploadedFiles,
  ): Promise<PostEntity> {
    return this.postService.create({ ...createPostDto, authorId: user.id }, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostComments })
  @ApiCreatedResponse({ description: 'Post comment was successfully created.', type: PostEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot create post comment. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/comments')
  public async createComment(
    @Param('id') id: PostEntity['id'],
    @Body() createPostCommentDto: CreatePostCommentDto,
    @AuthenticatedUser() user: UserPublicEntity,
    @Query() query?: Record<string, string>,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: CreatePostCommentUploadedFiles,
  ): Promise<PostCommentEntity> {
    return this.postCommentService.create(
      id,
      { ...createPostCommentDto, authorId: user.id },
      files,
      deserializeQueryString(query),
    );
  }

  @ApiCreatedResponse({
    description: 'Post donation was successfully created.',
    type: PostDonationEntity,
  })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot create post donation. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/donations')
  public async createDonation(
    @Param('id') id: string,
    @Body() createPostDonationDto: CreatePostDonationDto,
  ): Promise<PostDonationEntity> {
    return this.postDonationService.create(id, createPostDonationDto);
  }

  @ApiOkResponse({ description: 'The list of posts', type: [PostEntity] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<PostEntity[]> {
    return this.postService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The post with requested id', type: PostEntity })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<PostEntity> {
    return this.postService.findById(id, deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The list of post attachments', type: [PostAttachmentEntity] })
  @ApiNotFoundResponse({ description: 'The post with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/attachments')
  public async findAllPostAttachments(
    @Param('id') id: PostEntity['id'],
  ): Promise<PostAttachmentEntity[]> {
    return this.postAttachmentService.findAllForPost(id);
  }

  @ApiOkResponse({ description: 'The list of post donations', type: [PostDonationEntity] })
  @ApiNotFoundResponse({ description: 'The post with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/donations')
  public async findAllPostDonations(
    @Param('id') id: PostEntity['id'],
  ): Promise<PostDonationEntity[]> {
    return this.postDonationService.findAllForPost(id);
  }

  @ApiOkResponse({ description: 'The list of post comments', type: [PostCommentEntity] })
  @ApiNotFoundResponse({ description: 'The post with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/comments')
  public async findAllPostComments(
    @Param('id') id: PostEntity['id'],
  ): Promise<PostCommentEntity[]> {
    return this.postCommentService.findAllForPost(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePosts })
  @ApiOkResponse({ description: 'Post was successfully updated.', type: PostEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update post. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }, { name: 'image', maxCount: 1 }]))
  @Put(':id')
  public async update(
    @Param('id')
    id: PostEntity['id'],
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'image', minFileSize: 1, maxFileSize: 1024 * 1024 * 5 },
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: UpdatePostUploadedFiles,
  ): Promise<PostEntity> {
    return this.postService.update(id, updatePostDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePosts })
  @ApiOkResponse({ description: 'Post was successfully removed.', type: PostEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: PostEntity['id']): Promise<PostEntity> {
    return this.postService.remove(id);
  }
}
