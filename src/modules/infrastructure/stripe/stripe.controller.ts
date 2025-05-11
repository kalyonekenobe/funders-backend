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
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { deserializeQueryString } from 'src/core/utils/url.utils';
import { CreateStripeCustomerDto } from 'src/modules/infrastructure/stripe/DTO/create-stripe-customer.dto';
import { CreateStripePaymentIntentDto } from 'src/modules/infrastructure/stripe/DTO/create-stripe-payment-intent.dto';
import { CreateStripeSetupIntentDto } from 'src/modules/infrastructure/stripe/DTO/create-stripe-setup-intent.dto';
import { UpdateStripeCustomerDto } from 'src/modules/infrastructure/stripe/DTO/update-stripe-customer.dto';
import { StripeCustomerEntity } from 'src/modules/infrastructure/stripe/entities/stripe-customer.entity';
import { StripeDeletedCustomerEntity } from 'src/modules/infrastructure/stripe/entities/stripe-deleted-customer.entity';
import { StripePaymentIntentEntity } from 'src/modules/infrastructure/stripe/entities/stripe-payment-intent.entity';
import { StripePaymentMethodEntity } from 'src/modules/infrastructure/stripe/entities/stripe-payment-method.entity';
import { StripeSetupIntentEntity } from 'src/modules/infrastructure/stripe/entities/stripe-setup-intent.entity';
import { StripeService } from 'src/modules/infrastructure/stripe/stripe.service';
import {
  GetCustomerPaymentIntentsOptions,
  GetCustomerPaymentMethodsOptions,
} from 'src/modules/infrastructure/stripe/types/stripe.types';

@ApiTags(RoutesApiTags[Routes.Stripe])
@Controller(Routes.Stripe)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiOkResponse({ description: 'The stripe payment method', type: StripeSetupIntentEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the customer to be found.',
    schema: { example: 'cus_RNX1jeFf4oXvk3' },
  })
  @Post(':id/setup-intent')
  public async createStripePaymentMethod(
    @Param('id') id: string,
    @Body() createStripeSetupIntentDto: CreateStripeSetupIntentDto,
  ): Promise<StripeSetupIntentEntity> {
    return this.stripeService.createStripeSetupIntent(id, createStripeSetupIntentDto);
  }

  @ApiOkResponse({
    description: 'The list of payment methods for stripe customer',
    type: [StripePaymentMethodEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the customer to be found.',
    schema: { example: 'cus_RNX1jeFf4oXvk3' },
  })
  @Get('customers/:id/payment-methods')
  public async getStripeCustomerPaymentMethods(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<StripePaymentMethodEntity[]> {
    const options: GetCustomerPaymentMethodsOptions | undefined = deserializeQueryString(query);

    return this.stripeService.getStripeCustomerPaymentMethods(id, options);
  }

  @ApiOkResponse({
    description: 'The list of payment intents for stripe customer',
    type: [StripePaymentIntentEntity],
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the customer to be found.',
    schema: { example: 'cus_RNX1jeFf4oXvk3' },
  })
  @Get('customers/:id/payment-intents')
  public async getStripeCustomerPaymentIntents(
    @Param('id') id: string,
    @Query() query?: Record<string, string>,
  ): Promise<StripePaymentIntentEntity[]> {
    const options: GetCustomerPaymentIntentsOptions | undefined = deserializeQueryString(query);

    return this.stripeService.getStripeCustomerPaymentIntents(id, options);
  }

  @ApiCreatedResponse({ description: 'The stripe payment intent', type: StripePaymentIntentEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('payment-intents')
  public async createStripePaymentIntent(
    @Body() createStripePaymentIntentDto: CreateStripePaymentIntentDto,
  ): Promise<StripePaymentIntentEntity> {
    return this.stripeService.createStripePaymentIntent(createStripePaymentIntentDto);
  }

  @ApiCreatedResponse({
    description: 'Stripe customer was successfully created.',
    type: StripeCustomerEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: 'Cannot create the stripe customer. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('customers')
  public async createStripeCustomer(
    @Body() createStripeCustomerDto: CreateStripeCustomerDto,
  ): Promise<StripeCustomerEntity> {
    return this.stripeService.createStripeCustomer(createStripeCustomerDto);
  }

  @ApiOkResponse({
    description: 'Stripe customer was successfully updated.',
    type: StripeCustomerEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The stripe customer with the requested id was not found.' })
  @ApiConflictResponse({
    description: 'Cannot update the stripe customer. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the stripe customer to be updated',
    schema: { example: 'cus_RNX1jeFf4oXvk3' },
  })
  @Put('customers/:id')
  public async updateStripeCustomer(
    @Param('id') id: string,
    @Body() updateStripeCustomerDto: UpdateStripeCustomerDto,
  ): Promise<StripeCustomerEntity> {
    return this.stripeService.updateStripeCustomer(id, updateStripeCustomerDto);
  }

  @ApiOkResponse({
    description: 'Stripe customer was successfully removed.',
    type: StripeDeletedCustomerEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({ description: 'The stripe customer with the requested id was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the stripe customer to be deleted',
    schema: { example: 'cus_RNX1jeFf4oXvk3' },
  })
  @Delete('customers/:id')
  public async removeStripeCustomer(@Param('id') id: string): Promise<StripeDeletedCustomerEntity> {
    return this.stripeService.removeStripeCustomer(id);
  }

  @ApiOkResponse({
    description: 'Stripe payment method was successfully removed.',
    type: StripePaymentMethodEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiNotFoundResponse({
    description: 'The stripe payment method with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @ApiParam({
    name: 'id',
    description: 'The id of the stripe payment method to be deleted',
    schema: { example: 'pm_1Q0PsIJvEtkwdCNYMSaVuRz6' },
  })
  @Delete('payment-methods/:id')
  public async removeStripePaymentMethod(
    @Param('id') id: string,
  ): Promise<StripePaymentMethodEntity> {
    return this.stripeService.removeStripePaymentMethod(id);
  }
}
