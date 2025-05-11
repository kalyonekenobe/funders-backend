import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
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
import { PostCommentAttachmentService } from './post-comment-attachment.service';
import { PostCommentAttachmentEntity } from './entities/post-comment-attachment.entity';
import { UpdatePostCommentAttachmentDto } from './DTO/update-post-comment-attachment.dto';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/modules/user/types/user.types';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { UpdatePostCommentAttachmentUploadedFiles } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/types/post-comment-attachment.types';

@ApiTags(RoutesApiTags[Routes.PostCommentAttachments])
@Controller(Routes.PostCommentAttachments)
export class PostCommentAttachmentController {
  constructor(private readonly postCommentAttachmentService: PostCommentAttachmentService) {}

  @ApiOkResponse({
    description: 'The post comment attachment with requested id',
    type: PostCommentAttachmentEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post comment attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment attachment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: PostCommentAttachmentEntity['id'],
  ): Promise<PostCommentAttachmentEntity> {
    return this.postCommentAttachmentService.findById(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostComments })
  @ApiOkResponse({
    description: 'Post comment attachment was successfully updated.',
    type: PostCommentAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post comment attachment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post comment attachment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment attachment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Put(':id')
  public async update(
    @Param('id') id: PostCommentAttachmentEntity['id'],
    @Body() updatePostCommentAttachmentDto: UpdatePostCommentAttachmentDto,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'file', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 }])
    files?: UpdatePostCommentAttachmentUploadedFiles,
  ): Promise<PostCommentAttachmentEntity> {
    return this.postCommentAttachmentService.update(id, updatePostCommentAttachmentDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostComments })
  @ApiOkResponse({
    description: 'Post comment attachment was successfully removed.',
    type: PostCommentAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post comment attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment attachment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(
    @Param('id') id: PostCommentAttachmentEntity['id'],
  ): Promise<PostCommentAttachmentEntity> {
    return this.postCommentAttachmentService.remove(id);
  }
}
