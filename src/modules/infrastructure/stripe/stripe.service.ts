import { Inject, Injectable } from '@nestjs/common';
import { CreateStripeCustomerDto } from 'src/modules/infrastructure/stripe/DTO/create-stripe-customer.dto';
import { CreateStripePaymentIntentDto } from 'src/modules/infrastructure/stripe/DTO/create-stripe-payment-intent.dto';
import { CreateStripeSetupIntentDto } from 'src/modules/infrastructure/stripe/DTO/create-stripe-setup-intent.dto';
import { UpdateStripeCustomerDto } from 'src/modules/infrastructure/stripe/DTO/update-stripe-customer.dto';
import { StripeCustomerEntity } from 'src/modules/infrastructure/stripe/entities/stripe-customer.entity';
import { StripePaymentIntentEntity } from 'src/modules/infrastructure/stripe/entities/stripe-payment-intent.entity';
import { StripePaymentMethodEntity } from 'src/modules/infrastructure/stripe/entities/stripe-payment-method.entity';
import { StripeSetupIntentEntity } from 'src/modules/infrastructure/stripe/entities/stripe-setup-intent.entity';
import {
  GetCustomerPaymentIntentsOptions,
  GetCustomerPaymentMethodsOptions,
} from 'src/modules/infrastructure/stripe/types/stripe.types';
import { MODULE_OPTIONS_TOKEN } from 'src/modules/infrastructure/stripe/stripe.module-definition';
import { StripeModuleOptions } from 'src/modules/infrastructure/stripe/types/stripe.types';
import Stripe from 'stripe';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { StripeDeletedCustomerEntity } from 'src/modules/infrastructure/stripe/entities/stripe-deleted-customer.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService extends Stripe {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) readonly options: StripeModuleOptions,
    private readonly configService: ConfigService,
  ) {
    super(options.secretKey, options.options);
  }

  public async getStripeCustomerPaymentMethods(
    customerId: string,
    options?: GetCustomerPaymentMethodsOptions,
  ): Promise<StripePaymentMethodEntity[]> {
    const { data } = await this.paymentMethods.list({
      ...options,
      customer: customerId,
    });

    return data;
  }

  public async getStripeCustomerPaymentIntents(
    customerId: string,
    options?: GetCustomerPaymentIntentsOptions,
  ): Promise<StripePaymentIntentEntity[]> {
    const { data } = await this.paymentIntents.list({
      ...options,
      customer: customerId,
    });

    return data;
  }

  public async createStripeCustomer(
    createStripeCustomerDto: CreateStripeCustomerDto,
  ): Promise<StripeCustomerEntity> {
    const { lastResponse, ...customer } = await this.customers.create(createStripeCustomerDto);

    return customer;
  }

  public async createStripePaymentIntent(
    createPaymentIntentDto: CreateStripePaymentIntentDto,
  ): Promise<StripePaymentIntentEntity> {
    const {
      amount,
      currency,
      confirm,
      setupFutureUsage,
      customerId,
      paymentMethodId,
      authomaticPaymentMethods,
      paymentMethodTypes,
    } = createPaymentIntentDto;

    const { lastResponse, ...paymentIntent } = await this.paymentIntents.create({
      amount,
      confirm,
      currency:
        currency || this.configService.get<string>(ConfigVariables.StripeDefaultCurrency) || 'USD',
      setup_future_usage: setupFutureUsage,
      customer: customerId || undefined,
      payment_method: paymentMethodId,
      automatic_payment_methods: authomaticPaymentMethods || { enabled: false },
      payment_method_types: paymentMethodTypes || ['card'],
    });

    return paymentIntent;
  }

  public async createStripeSetupIntent(
    customerId: string,
    createStripeSetupIntentDto: CreateStripeSetupIntentDto,
  ): Promise<StripeSetupIntentEntity> {
    const { paymentMethodTypes } = createStripeSetupIntentDto;
    const { lastResponse, ...setupIntent } = await this.setupIntents.create({
      customer: customerId,
      payment_method_types: paymentMethodTypes,
    });

    return setupIntent;
  }

  public async updateStripeCustomer(
    customerId: string,
    updateStripeCustomerDto: UpdateStripeCustomerDto,
  ): Promise<StripeCustomerEntity> {
    const { lastResponse, ...customer } = await this.customers.update(
      customerId,
      updateStripeCustomerDto,
    );

    return customer;
  }

  public async removeStripeCustomer(customerId: string): Promise<StripeDeletedCustomerEntity> {
    const { lastResponse, ...customer } = await this.customers.del(customerId);

    return customer;
  }

  public async removeStripePaymentMethod(
    paymentMethodId: string,
  ): Promise<StripePaymentMethodEntity> {
    const { lastResponse, ...paymentMethod } = await this.paymentMethods.detach(paymentMethodId);

    return paymentMethod;
  }
}
