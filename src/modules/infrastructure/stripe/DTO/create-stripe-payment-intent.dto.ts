import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Stripe } from 'stripe';

export class CreateStripePaymentIntentDto {
  @ApiProperty({
    description:
      'Amount in smallest currency unit (e.g. 1 USD = 100 cents, 1 UAH = 100 kopiykas etc.) of the payment intent',
    examples: [10000, 500],
    default: 10000,
  })
  @IsNumber()
  @IsPositive()
  @IsDefined()
  amount: number;

  @ApiProperty({
    description: 'The currency of the stripe payment intent',
    examples: ['USD', 'EUR'],
    default: 'USD',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  currency?: string;

  @ApiProperty({
    description: 'The confirm flag of the stripe payment intent',
    examples: [true, false],
    default: true,
  })
  @IsBoolean()
  @ValidateIf((_, value) => value)
  confirm?: boolean;

  @ApiProperty({
    description: 'The setup future usage of the stripe payment intent',
    examples: ['on_session', 'off_session'],
    default: 'on_session',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  setupFutureUsage?: Stripe.PaymentIntentCreateParams.SetupFutureUsage;

  @ApiProperty({
    description: 'Stripe customer id of the payment intent',
    examples: ['cus_NffrFeUfNV2Hib', 'cus_FJANdAJafEQdIq'],
    default: 'cus_NffrFeUfNV2Hib',
  })
  @MaxLength(255)
  @IsString()
  @ValidateIf((_, value) => value)
  customerId: string | null;

  @ApiProperty({
    description: 'The payment method id of the stripe payment intent',
    examples: ['pm_1Q0PsIJvEtkwdCNYMSaVuRz6'],
    default: 'pm_1Q0PsIJvEtkwdCNYMSaVuRz6',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  paymentMethodId: string;

  @ApiProperty({
    description: 'The authomatic payment methods params of the stripe payment intent',
    examples: [{ enabled: true }],
    default: { enabled: true },
  })
  @ValidateIf((_, value) => value)
  authomaticPaymentMethods?: any;

  @ApiProperty({
    description: 'The payment method types of the stripe payment intent',
    examples: [['card', 'link'], ['card']],
    default: ['card', 'link'],
  })
  @IsArray()
  @ValidateIf((_, value) => value)
  paymentMethodTypes?: string[];
}
