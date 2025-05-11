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
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PostAttachmentService } from 'src/modules/post/submodules/post-attachment/post-attachment.service';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { PostAttachmentEntity } from 'src/modules/post/submodules/post-attachment/entities/post-attachment.entity';
import { Permissions } from 'src/modules/user/types/user.types';
import { UpdatePostAttachmentUploadedFiles } from 'src/modules/post/submodules/post-attachment/types/post-attachment.types';
import { UpdatePostAttachmentDto } from 'src/modules/post/submodules/post-attachment/DTO/update-post-attachment.dto';

@ApiTags(RoutesApiTags[Routes.PostAttachments])
@Controller(Routes.PostAttachments)
export class PostAttachmentController {
  constructor(private readonly postAttachmentService: PostAttachmentService) {}

  @ApiOkResponse({
    description: 'The post attachment with requested id',
    type: PostAttachmentEntity,
  })
  @ApiNotFoundResponse({ description: 'The post attachment with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post attachment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: PostAttachmentEntity['id'],
  ): Promise<PostAttachmentEntity> {
    return this.postAttachmentService.findById(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePosts })
  @ApiOkResponse({
    description: 'Post attachment was successfully updated.',
    type: PostAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post attachment with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update post attachment. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post attachment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePostAttachmentDto: Omit<UpdatePostAttachmentDto, 'file'>,
    @UploadedFiles()
    @UploadRestrictions([{ fieldname: 'file', minFileSize: 1, maxFileSize: 1024 * 1024 * 50 }])
    files?: UpdatePostAttachmentUploadedFiles,
  ): Promise<PostAttachmentEntity> {
    return this.postAttachmentService.update(id, updatePostAttachmentDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePosts })
  @ApiOkResponse({
    description: 'Post attachment was successfully removed.',
    type: PostAttachmentEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post attachment with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post attachment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: PostAttachmentEntity['id']): Promise<PostAttachmentEntity> {
    return this.postAttachmentService.remove(id);
  }
}
