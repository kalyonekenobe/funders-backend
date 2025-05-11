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
import { CreatePostCommentReportDto } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/DTO/create-post-comment-report.dto';
import { UpdatePostCommentReportDto } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/DTO/update-post-comment-report.dto';
import { PostCommentReportEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/entities/post-comment-report.entity';
import { PostCommentReportService } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/post-comment-report.service';

@ApiTags(RoutesApiTags[Routes.PostCommentReports])
@Controller(Routes.PostCommentReports)
export class PostCommentReportController {
  constructor(private readonly postCommentReportService: PostCommentReportService) {}

  @ApiOkResponse({
    description: 'The list of post comment reports',
    type: [PostCommentReportEntity],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(
    @Query() query?: Record<string, string>,
  ): Promise<PostCommentReportEntity[]> {
    return this.postCommentReportService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The post comment report', type: PostCommentReportEntity })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment report to be found',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<PostCommentReportEntity> {
    return this.postCommentReportService.findOne(
      _.merge(deserializeQueryString(query), { where: { id } }),
    );
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Post comment report was successfully created.',
    type: PostCommentReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The post comment is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The post comment is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: 'Cannot create post comment report. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post()
  public async create(
    @Body() createPostCommentReportDto: CreatePostCommentReportDto,
  ): Promise<PostCommentReportEntity> {
    return this.postCommentReportService.create(createPostCommentReportDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post comment report was successfully updated.',
    type: PostCommentReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The post comment is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The post comment is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post comment report with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post comment report. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment report to be updated',
    schema: { example: 'Administrator' },
  })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePostCommentReportDto: UpdatePostCommentReportDto,
  ): Promise<PostCommentReportEntity> {
    return this.postCommentReportService.update(id, updatePostCommentReportDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post comment report was successfully removed.',
    type: PostCommentReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The post comment is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The post comment is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post comment report with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment report to be deleted',
    schema: { example: 'Administrator' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<PostCommentReportEntity> {
    return this.postCommentReportService.remove(id);
  }
}
