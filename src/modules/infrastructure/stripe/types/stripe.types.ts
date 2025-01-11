import Stripe from 'stripe';

export interface StripeModuleOptions {
  secretKey: string;
  options: Stripe.StripeConfig;
}

export interface GetCustomerPaymentMethodsOptions {
  type?: Stripe.PaymentMethodListParams.Type;
}

export interface GetCustomerPaymentIntentsOptions {
  created?: Stripe.RangeQueryParam;
}
