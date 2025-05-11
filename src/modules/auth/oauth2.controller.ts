import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiTemporaryRedirectResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RoutesApiTags } from 'src/core/constants';
import { ConfigVariables, Routes } from 'src/core/enums/app.enums';
import { AuthService } from 'src/modules/auth/auth.service';
import { GenerateOAuth2UrlDto } from 'src/modules/auth/DTO/generate-oauth2-url.dto';

@ApiTags(RoutesApiTags[Routes.OAuth2])
@Controller(Routes.OAuth2)
export class OAuth2Controller {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiCreatedResponse({ description: 'The generated google OAuth2 url.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/google')
  public async generateGoogleOAuth2Url(
    @Body() data: GenerateOAuth2UrlDto,
    @Res() response: Response,
  ): Promise<Response> {
    const url = await this.authService.generateGoogleOAuth2Url(data);

    return response.status(HttpStatus.CREATED).json({ url });
  }

  @ApiTemporaryRedirectResponse({ description: 'The redirect response.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get('/callback/google')
  public async generateGoogleOAuth2Token(
    @Query('state') state: string,
    @Query('code') code: string,
    @Res() response: Response,
  ): Promise<void> {
    const { token } = await this.authService.generateGoogleOAuth2Token(code, JSON.parse(state));

    return response
      .cookie(
        this.configService.get<string>(ConfigVariables.CookieOAuth2TokenName) ||
          'Funders-OAuth2-Token',
        token,
        {
          path: '/',
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .redirect(JSON.parse(state).referer);
  }

  @ApiCreatedResponse({ description: 'The generated discord OAuth2 url.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/discord')
  public async generateDiscordOAuth2Url(
    @Body() data: GenerateOAuth2UrlDto,
    @Res() response: Response,
  ): Promise<Response> {
    const url = await this.authService.generateDiscordOAuth2Url(data);

    return response.status(HttpStatus.CREATED).json({ url });
  }

  @ApiTemporaryRedirectResponse({ description: 'The redirect response.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get('/callback/discord')
  public async generateDiscordOAuth2Token(
    @Query('state') state: string,
    @Query('code') code: string,
    @Res() response: Response,
  ): Promise<void> {
    const { token } = await this.authService.generateDiscordOAuth2Token(code, JSON.parse(state));

    return response
      .cookie(
        this.configService.get<string>(ConfigVariables.CookieOAuth2TokenName) ||
          'Funders-OAuth2-Token',
        token,
        {
          path: '/',
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .redirect(JSON.parse(state).referer);
  }
}
