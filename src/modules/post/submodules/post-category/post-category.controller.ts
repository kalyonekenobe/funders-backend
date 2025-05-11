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
import { Routes } from 'src/core/enums/app.enums';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreatePostCategoryDto } from 'src/modules/post/submodules/post-category/DTO/create-post-category.dto';
import { UpdatePostCategoryDto } from 'src/modules/post/submodules/post-category/DTO/update-post-category.dto';
import { PostCategoryEntity } from 'src/modules/post/submodules/post-category/entities/post-category.entity';
import { PostCategoryService } from 'src/modules/post/submodules/post-category/post-category.service';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.PostCategories])
@Controller(Routes.PostCategories)
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostCategories })
  @ApiCreatedResponse({
    description: 'Post category was successfully created.',
    type: PostCategoryEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create post category. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post()
  public async create(
    @Body() createPostCategoryDto: CreatePostCategoryDto,
  ): Promise<PostCategoryEntity> {
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @ApiOkResponse({ description: 'The list of post categories', type: [PostCategoryEntity] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(): Promise<PostCategoryEntity[]> {
    return this.postCategoryService.findAll();
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostCategories })
  @ApiOkResponse({
    description: 'Post category was successfully updated.',
    type: PostCategoryEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post category with requested name was not found.' })
  @ApiConflictResponse({ description: 'Cannot update post category. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the post category to be updated',
    schema: { example: 'Army' },
  })
  @Put(':name')
  public async update(
    @Param('name') name: PostCategoryEntity['name'],
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<PostCategoryEntity> {
    return this.postCategoryService.update(name, updatePostCategoryDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostCategories })
  @ApiOkResponse({
    description: 'Post category was successfully removed.',
    type: PostCategoryEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post category with requested name was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'name',
    description: 'The name of the post category to be deleted',
    schema: { example: 'Army' },
  })
  @Delete(':name')
  public async remove(
    @Param('name') name: PostCategoryEntity['name'],
  ): Promise<PostCategoryEntity> {
    return this.postCategoryService.remove(name);
  }
}
