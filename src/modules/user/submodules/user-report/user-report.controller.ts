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
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { CreateUserReportDto } from 'src/modules/user/submodules/user-report/DTO/create-user-report.dto';
import { UpdateUserReportDto } from 'src/modules/user/submodules/user-report/DTO/update-user-report.dto';
import { UserReportEntity } from 'src/modules/user/submodules/user-report/entities/user-report.entity';
import { UserReportService } from 'src/modules/user/submodules/user-report/user-report.service';

@ApiTags(RoutesApiTags[Routes.UserReports])
@Controller(Routes.UserReports)
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @ApiOkResponse({ description: 'The list of user reports', type: [UserReportEntity] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get()
  public async findAll(@Query() query?: Record<string, string>): Promise<UserReportEntity[]> {
    return this.userReportService.findAll(deserializeQueryString(query));
  }

  @ApiOkResponse({ description: 'The user report', type: UserReportEntity })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user report to be found',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<UserReportEntity> {
    return this.userReportService.findOne(
      _.merge(deserializeQueryString(query), { where: { id } }),
    );
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'User report was successfully created.',
    type: UserReportEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot create user report. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post()
  public async create(
    @Body() createUserReportDto: CreateUserReportDto,
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
  ): Promise<UserReportEntity> {
    return this.userReportService.create({
      ...createUserReportDto,
      reporterId: authenticatedUser.id,
    });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'User report was successfully updated.', type: UserReportEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user report with the requested id was not found.' })
  @ApiConflictResponse({ description: 'Cannot update user report. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user report to be updated',
    schema: { example: 'Administrator' },
  })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserReportDto: UpdateUserReportDto,
  ): Promise<UserReportEntity> {
    return this.userReportService.update(id, updateUserReportDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'User report was successfully removed.', type: UserReportEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The user report with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the user report to be deleted',
    schema: { example: 'Administrator' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<UserReportEntity> {
    return this.userReportService.remove(id);
  }
}
