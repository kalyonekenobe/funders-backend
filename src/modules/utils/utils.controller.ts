import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { CountResponse, ObjectKeysCountResponse } from 'src/modules/utils/types/utils.types';
import { UtilsService } from 'src/modules/utils/utils.service';

@ApiTags(RoutesApiTags[Routes.Utils])
@Controller(Routes.Utils)
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The total count of users.' })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get('/count/users')
  public async countUsers(@Query() query: Record<string, string>): Promise<CountResponse> {
    return this.utilsService.countUsers(deserializeQueryString(query));
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The total count of unread messages for each chat.' })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get('/count/chats/messages/unread')
  public async countUnreadMessagesInChats(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Query() query: Record<string, string>,
  ): Promise<ObjectKeysCountResponse> {
    return this.utilsService.countUnreadMessagesInChats(
      authenticatedUser,
      deserializeQueryString(query),
    );
  }
}
