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
import { CreatePostReportDto } from 'src/modules/post/submodules/post-report/DTO/create-post-report.dto';
import { UpdatePostReportDto } from 'src/modules/post/submodules/post-report/DTO/update-post-report.dto';
import { PostReportEntity } from 'src/modules/post/submodules/post-report/entities/post-report.entity';
import { PostReportService } from 'src/modules/post/submodules/post-report/post-report.service';

@ApiTags(RoutesApiTags[Routes.PostReports])
@Controller(Routes.PostReports)
export class PostReportController {
  constructor(private readonly postReportService: PostReportService) {}

  @ApiOkResponse({
    description: 'The list of post reports',
    type: [PostReportEntity],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<PostReportEntity[]> {
    return this.postReportService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The post report', type: PostReportEntity })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post report to be found',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<PostReportEntity> {
    return this.postReportService.findOne(
      _.merge(deserializeQueryString(query), { where: { id } }),
    );
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Post report was successfully created.',
    type: PostReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The post is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The post is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: 'Cannot create post report. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post()
  public async create(@Body() createPostReportDto: CreatePostReportDto): Promise<PostReportEntity> {
    return this.postReportService.create(createPostReportDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post report was successfully updated.',
    type: PostReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The post is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The post is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post report with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post report. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post report to be updated',
    schema: { example: 'Administrator' },
  })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePostReportDto: UpdatePostReportDto,
  ): Promise<PostReportEntity> {
    return this.postReportService.update(id, updatePostReportDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post report was successfully removed.',
    type: PostReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The post is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The post is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The post report with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post report to be deleted',
    schema: { example: 'Administrator' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<PostReportEntity> {
    return this.postReportService.remove(id);
  }
}
