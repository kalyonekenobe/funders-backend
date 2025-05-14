import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Stripe } from 'stripe';

export class StripePaymentIntentEntity implements Stripe.PaymentIntent {
  @ApiProperty({
    description: 'The id of the stripe payment intent',
    examples: ['pi_3MtwBwLkdIwHu7ix28a3tqPa'],
    default: 'pi_3MtwBwLkdIwHu7ix28a3tqPa',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'The object name of the stripe payment intent',
    examples: ['payment_intent'],
    default: 'payment_intent',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  object: 'payment_intent';

  @ApiProperty({
    description: 'The amount of the stripe payment intent',
    examples: [2000],
    default: 2000,
  })
  @IsNumber()
  @IsPositive()
  @IsDefined()
  amount: number;

  @ApiProperty({
    description: 'The amount capturable of the stripe payment intent',
    examples: [0],
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsDefined()
  amount_capturable: number;

  @ApiProperty({
    description: 'The amount details of the stripe payment intent',
    default: {
      tip: {},
    },
  })
  @ValidateIf((_, value) => value)
  amount_details?: Stripe.PaymentIntent.AmountDetails | undefined;

  @ApiProperty({
    description: 'The amount received of the stripe payment intent',
    examples: [0],
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsDefined()
  amount_received: number;

  @ApiProperty({
    description: 'The application of the stripe payment intent',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  application: string | Stripe.Application | null;

  @ApiProperty({
    description: 'The application fee amount of the stripe payment intent',
    examples: [null, 0],
    default: null,
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((_, value) => value)
  application_fee_amount: number | null;

  @ApiProperty({
    description: 'The automatic payment methods of the stripe payment intent',
    default: {
      enabled: true,
    },
  })
  @ValidateIf((_, value) => value)
  automatic_payment_methods: Stripe.PaymentIntent.AutomaticPaymentMethods | null;

  @ApiProperty({
    description: 'The canceled at timestamp of the stripe payment intent',
    examples: [null, 1689047615],
    default: null,
  })
  @IsNumber()
  @IsPositive()
  @ValidateIf((_, value) => value)
  canceled_at: number | null;

  @ApiProperty({
    description: 'The cancelation reason of the stripe payment intent',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  cancellation_reason: Stripe.PaymentIntent.CancellationReason | null;

  @ApiProperty({
    description: 'The capture method of the stripe payment intent',
    examples: ['automatic', 'automatic_async', 'manual'],
    default: 'automatic',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  capture_method: Stripe.PaymentIntent.CaptureMethod;

  @ApiProperty({
    description: 'The client secret of the stripe payment intent',
    examples: ['pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH'],
    default: 'pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH',
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  client_secret: string | null;

  @ApiProperty({
    description: 'The confirmation method of the stripe payment intent',
    examples: ['automatic', 'manual'],
    default: 'automatic',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  confirmation_method: Stripe.PaymentIntent.ConfirmationMethod;

  @ApiProperty({
    description: 'The created timestamp of the stripe payment intent',
    examples: [1680800504],
    default: 1680800504,
  })
  @IsNumber()
  @IsPositive()
  @IsDefined()
  created: number;

  @ApiProperty({
    description: 'The currency of the payment intent',
    examples: ['usd'],
    default: 'usd',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  currency: string;

  @ApiProperty({
    description: 'The customer associated with the payment intent',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  @ApiProperty({
    description: 'A description of the payment intent',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  description: string | null;

  @ApiProperty({
    description: 'The last payment error encountered by this PaymentIntent, if any.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  last_payment_error: Stripe.PaymentIntent.LastPaymentError | null;

  @ApiProperty({
    description: 'The ID of the latest charge or the full charge object, if expanded.',
    examples: [null, 'ch_1Mw0sZLkdIwHu7ixuxhI2E2e'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  latest_charge: string | Stripe.Charge | null;

  @ApiProperty({
    description: 'Indicates whether the PaymentIntent was created in live mode.',
    examples: [true],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  livemode: boolean;

  @ApiProperty({
    description: 'Metadata associated with the payment intent',
    default: {},
  })
  @IsDefined()
  metadata: Stripe.Metadata;

  @ApiProperty({
    description: 'The next action to perform for this PaymentIntent, if any.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  next_action: Stripe.PaymentIntent.NextAction | null;

  @ApiProperty({
    description: 'The account on behalf of which the charge is being made, if applicable.',
    examples: [null, 'acct_1Mw0TZLkdIwHu7ix'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  on_behalf_of: string | Stripe.Account | null;

  @ApiProperty({
    description: 'The payment method used for the PaymentIntent.',
    examples: [null, 'pm_1Mw0s2LkdIwHu7ixxI9v4QoW'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  payment_method: string | Stripe.PaymentMethod | null;

  @ApiProperty({
    description: 'Additional details about the payment method configuration.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  payment_method_configuration_details: Stripe.PaymentIntent.PaymentMethodConfigurationDetails | null;

  @ApiProperty({
    description: 'Payment method options for this PaymentIntent.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  payment_method_options: Stripe.PaymentIntent.PaymentMethodOptions | null;

  @ApiProperty({
    description: 'Types of payment methods supported by this PaymentIntent.',
    examples: [['card', 'bank_transfer']],
    default: ['card'],
  })
  @IsDefined()
  @IsNotEmpty()
  payment_method_types: string[];

  @ApiProperty({
    description: 'Processing details for the PaymentIntent, if applicable.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  processing: Stripe.PaymentIntent.Processing | null;

  @ApiProperty({
    description: 'The email address to which the receipt for this PaymentIntent will be sent.',
    examples: [null, 'user@example.com'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  receipt_email: string | null;

  @ApiProperty({
    description: 'The review associated with this PaymentIntent, if any.',
    examples: [null, 'prv_1Mw0s8LkdIwHu7ix3D9rTWxs'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  review: string | Stripe.Review | null;

  @ApiProperty({
    description: 'Indicates whether the PaymentIntent can be used for future payments.',
    examples: [null, 'off_session'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  setup_future_usage: Stripe.PaymentIntent.SetupFutureUsage | null;

  @ApiProperty({
    description: 'Shipping information for this PaymentIntent, if applicable.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  shipping: Stripe.PaymentIntent.Shipping | null;

  @ApiProperty({
    description: 'The source of funds for the PaymentIntent.',
    examples: [null, 'src_1Mw0sJLkdIwHu7ixIBDaCePu'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  source: string | Stripe.CustomerSource | Stripe.DeletedCustomerSource | null;

  @ApiProperty({
    description: 'A statement descriptor for the PaymentIntent.',
    examples: [null, 'My Business'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  statement_descriptor: string | null;

  @ApiProperty({
    description: 'A suffix for the statement descriptor.',
    examples: [null, 'Invoice #1234'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  statement_descriptor_suffix: string | null;

  @ApiProperty({
    description: 'The current status of the PaymentIntent.',
    examples: ['requires_payment_method'],
    default: 'requires_payment_method',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  status: Stripe.PaymentIntent.Status;

  @ApiProperty({
    description: 'Details about the funds transfer, if applicable.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  transfer_data: Stripe.PaymentIntent.TransferData | null;

  @ApiProperty({
    description: 'A transfer group identifier for this PaymentIntent.',
    examples: [null, 'group_1234'],
    default: null,
  })
  @ValidateIf((_, value) => value)
  transfer_group: string | null;
}
