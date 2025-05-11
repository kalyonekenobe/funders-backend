import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiConflictResponse,
  ApiConsumes,
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
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdatePostCommentDto } from 'src/modules/post/submodules/post-comment/DTO/update-post-comment.dto';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { PostCommentService } from 'src/modules/post/submodules/post-comment/post-comment.service';
import { PostCommentAttachmentEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/entities/post-comment-attachment.entity';
import { PostCommentAttachmentService } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/post-comment-attachment.service';
import { UpdatePostCommentUploadedFiles } from 'src/modules/post/submodules/post-comment/types/post-comment.types';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.PostComments])
@Controller(Routes.PostComments)
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly postCommentAttachmentService: PostCommentAttachmentService,
  ) {}

  @ApiOkResponse({ description: 'The post comment with requested id', type: PostCommentEntity })
  @ApiNotFoundResponse({ description: 'The post comment with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(@Param('id') id: PostCommentEntity['id']): Promise<PostCommentEntity> {
    return this.postCommentService.findById(id);
  }

  @ApiOkResponse({
    description: 'The list of post comment attachments',
    type: [PostCommentAttachmentEntity],
  })
  @ApiNotFoundResponse({ description: 'The post comment with specified id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/attachments')
  public async findAllPostCommentAttachments(
    @Param('id') id: PostCommentEntity['id'],
  ): Promise<PostCommentAttachmentEntity[]> {
    return this.postCommentAttachmentService.findAllForComment(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostComments })
  @ApiOkResponse({ description: 'Post comment was successfully updated.', type: PostCommentEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post comment with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update post comment. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @Put(':id')
  public async update(
    @Param('id') id: PostCommentEntity['id'],
    @Body() updatePostCommentDto: UpdatePostCommentDto,
    @Query() query?: Record<string, string>,
    @UploadedFiles()
    @UploadRestrictions([
      { fieldname: 'attachments', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 },
    ])
    files?: UpdatePostCommentUploadedFiles,
  ): Promise<PostCommentEntity> {
    return this.postCommentService.update(
      id,
      updatePostCommentDto,
      files,
      deserializeQueryString(query),
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostComments })
  @ApiOkResponse({ description: 'Post comment was successfully removed.', type: PostCommentEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post comment with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: PostCommentEntity['id']): Promise<PostCommentEntity> {
    return this.postCommentService.remove(id);
  }
}
