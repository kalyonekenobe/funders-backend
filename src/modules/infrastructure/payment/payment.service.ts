import { Injectable } from '@nestjs/common';
import { ChargeDto } from 'src/modules/infrastructure/payment/DTO/charge.dto';
import {
  PaymentChargeResponse,
  PaymentListResponse,
  UpdateCustomerPayload,
} from 'src/modules/infrastructure/payment/types/payment.types';
import { StripeService } from 'src/modules/infrastructure/stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  public async createCustomer(
    payload: Stripe.CustomerCreateParams,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripeService.customers.create(payload);
  }

  public async updateCustomer(
    customerId: string,
    payload: UpdateCustomerPayload,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripeService.customers.update(customerId, payload);
  }

  public async deleteCustomer(
    customerId: string,
  ): Promise<Stripe.Response<Stripe.DeletedCustomer>> {
    return this.stripeService.customers.del(customerId);
  }

  public async charge(payload: ChargeDto): Promise<PaymentChargeResponse> {
    try {
      const paymentIntent = await this.stripeService.paymentIntents.create({
        amount: payload.amount * 100,
        currency: process.env.STRIPE_CURRENCY ?? 'USD',
        customer: payload.customerId,
        payment_method: payload.paymentMethodId,
        automatic_payment_methods: { enabled: false },
        payment_method_types: ['card'],
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getCustomerCards(customerId: string): Promise<PaymentListResponse[]> {
    const { data } = await this.stripeService.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return data.map(item => {
      if (!item.card) {
        throw new Error('Cannot get the list of customer cards!');
      }

      return { ...item.card, id: item.id };
    });
  }

  public async addCustomerCard(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.Response<Stripe.SetupIntent>> {
    return this.stripeService.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });
  }

  public async deleteCustomerCard(cardId: string): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    return this.stripeService.paymentMethods.detach(cardId);
  }

  public async getCustomerPaymentIntents(
    customerId: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentIntent>>> {
    return this.stripeService.paymentIntents.list({ customer: customerId });
  }
}
