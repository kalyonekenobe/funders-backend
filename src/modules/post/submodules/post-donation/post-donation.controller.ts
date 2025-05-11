import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
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
import { UpdatePostDonationDto } from 'src/modules/post/submodules/post-donation/DTO/update-post-donation.dto';
import { PostDonationEntity } from 'src/modules/post/submodules/post-donation/entities/post-donation.entity';
import { PostDonationService } from 'src/modules/post/submodules/post-donation/post-donation.service';
import { Permissions } from 'src/modules/user/types/user.types';

@ApiTags(RoutesApiTags[Routes.PostDonations])
@Controller(Routes.PostDonations)
export class PostDonationController {
  constructor(private readonly postDonationService: PostDonationService) {}

  @ApiOkResponse({ description: 'The post donation with requested id', type: PostDonationEntity })
  @ApiNotFoundResponse({ description: 'The post donation with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post donation to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  public async findById(@Param('id') id: PostDonationEntity['id']): Promise<PostDonationEntity> {
    return this.postDonationService.findById(id);
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.ManagePostComments |
      Permissions.ManageChats |
      Permissions.ManageChatMessages |
      Permissions.ManagePosts |
      Permissions.ManagePostCategories |
      Permissions.ManageUsers |
      Permissions.ManageUserBans,
  })
  @ApiOkResponse({
    description: 'Post donation was successfully updated.',
    type: PostDonationEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post donation with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update post donation. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post donation to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put(':id')
  public async update(
    @Param('id') id: PostDonationEntity['id'],
    @Body() updatePostDonationDto: UpdatePostDonationDto,
  ): Promise<PostDonationEntity> {
    return this.postDonationService.update(id, updatePostDonationDto);
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.ManagePostComments |
      Permissions.ManageChats |
      Permissions.ManageChatMessages |
      Permissions.ManagePosts |
      Permissions.ManagePostCategories |
      Permissions.ManageUsers |
      Permissions.ManageUserBans,
  })
  @ApiOkResponse({
    description: 'Post donation was successfully removed.',
    type: PostDonationEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The post donation with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post donation to be removed',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: PostDonationEntity['id']): Promise<PostDonationEntity> {
    return this.postDonationService.remove(id);
  }
}
