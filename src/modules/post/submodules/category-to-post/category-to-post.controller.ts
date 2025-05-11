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
import ValidationPipes from 'src/core/config/validation.pipes';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/modules/user/types/user.types';
import { PostCategoryEntity } from 'src/modules/post/submodules/post-category/entities/post-category.entity';
import { CategoryToPostService } from 'src/modules/post/submodules/category-to-post/category-to-post.service';
import { Routes } from 'src/core/enums/app.enums';
import { RoutesApiTags } from 'src/core/constants';
import { PostEntity } from 'src/modules/post/entities/post.entity';

@ApiTags(RoutesApiTags[Routes.CategoryToPost])
@Controller(Routes.CategoryToPost)
export class CategoryToPostController {
  constructor(private readonly categoryToPostService: CategoryToPostService) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostCategories })
  @ApiCreatedResponse({
    description: 'The list of categories was successfully added to the post.',
    type: [PostCategoryEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot add the list of categories to the post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to add the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post()
  public async createPostCategories(
    @Param('id') postId: PostEntity['id'],
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.categoryToPostService.createPostCategories(postId, postCategoriesList);
  }

  @ApiOkResponse({ description: 'The list of categories of the post', type: [PostCategoryEntity] })
  @ApiNotFoundResponse({ description: 'Cannot find post with the specified id.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to find the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get()
  public async findAllPostCategories(
    @Param('id') postId: PostEntity['id'],
  ): Promise<PostCategoryEntity[]> {
    return this.categoryToPostService.findAllPostCategories(postId);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostCategories })
  @ApiOkResponse({
    description: 'The list of categories of the post was successfully updated.',
    type: [PostCategoryEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot update the list of categories of the post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to update the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put()
  public async updatePostCategories(
    @Param('id') postId: PostEntity['id'],
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.categoryToPostService.updatePostCategories(postId, postCategoriesList);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.ManagePostCategories })
  @ApiOkResponse({
    description: 'The list of categories of the post was successfully removed.',
    type: [PostCategoryEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the post to delete the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete()
  public async removePostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.categoryToPostService.removePostCategories(postId, postCategoriesList);
  }
}
