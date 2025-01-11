import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Stripe } from 'stripe';

export class StripeSetupIntentEntity implements Stripe.SetupIntent {
  @ApiProperty({
    description: 'Unique identifier for the SetupIntent.',
    examples: ['seti_1Mm8s8LkdIwHu7ix0OXBfTRG'],
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'String representing the object type.',
    default: 'setup_intent',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  object: 'setup_intent';

  @ApiProperty({
    description: 'ID of the associated application, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  application: string | Stripe.Application | null;

  @ApiProperty({
    description: 'Whether to attach the SetupIntent to self.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  attach_to_self?: boolean | undefined;

  @ApiProperty({
    description: 'Automatic payment methods settings.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  automatic_payment_methods: Stripe.SetupIntent.AutomaticPaymentMethods | null;

  @ApiProperty({
    description: 'Reason for cancellation, if cancelled.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  cancellation_reason: Stripe.SetupIntent.CancellationReason | null;

  @ApiProperty({
    description: 'The client secret of the SetupIntent.',
    examples: ['seti_1Mm8s8LkdIwHu7ix0OXBfTRG_secret_NXDICkPqPeiBTAFqWmkbff09lRmSVXe'],
    default: 'seti_1Mm8s8LkdIwHu7ix0OXBfTRG_secret_NXDICkPqPeiBTAFqWmkbff09lRmSVXe',
  })
  @ValidateIf((_, value) => value)
  client_secret: string | null;

  @ApiProperty({
    description: 'Time at which the SetupIntent was created.',
    examples: [1678942624],
    default: 1678942624,
  })
  @IsNumber()
  @IsPositive()
  @IsDefined()
  created: number;

  @ApiProperty({
    description: 'ID of the associated customer, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  @ApiProperty({
    description: 'An arbitrary string attached to the object.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  description: string | null;

  @ApiProperty({
    description: 'Flow directions for the SetupIntent.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  flow_directions: Stripe.SetupIntent.FlowDirection[] | null;

  @ApiProperty({
    description: 'Details of the last setup error, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  last_setup_error: Stripe.SetupIntent.LastSetupError | null;

  @ApiProperty({
    description: 'Details of the latest setup attempt, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  latest_attempt: string | Stripe.SetupAttempt | null;

  @ApiProperty({
    description: 'Indicates whether the object exists in live mode.',
    examples: [true, false],
  })
  @IsBoolean()
  @IsDefined()
  livemode: boolean;

  @ApiProperty({
    description: 'ID of the mandate created, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  mandate: string | Stripe.Mandate | null;

  @ApiProperty({
    description: 'Set of key-value pairs attached to the object.',
    default: {},
  })
  @ValidateIf((_, value) => value)
  metadata: Stripe.Metadata | null;

  @ApiProperty({
    description: 'Next action required by the SetupIntent.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  next_action: Stripe.SetupIntent.NextAction | null;

  @ApiProperty({
    description: 'ID of the account on behalf of which the SetupIntent was created.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  on_behalf_of: string | Stripe.Account | null;

  @ApiProperty({
    description: 'ID of the payment method used, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  payment_method: string | Stripe.PaymentMethod | null;

  @ApiProperty({
    description: 'Payment method configuration details, if available.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  payment_method_configuration_details: Stripe.SetupIntent.PaymentMethodConfigurationDetails | null;

  @ApiProperty({
    description: 'Payment method options used by the SetupIntent.',
    default: {
      card: {
        mandate_options: null,
        network: null,
        request_three_d_secure: 'automatic',
      },
    },
  })
  @ValidateIf((_, value) => value)
  payment_method_options: Stripe.SetupIntent.PaymentMethodOptions | null;

  @ApiProperty({
    description: 'List of payment method types supported.',
    examples: [['card']],
  })
  @IsDefined()
  @IsNotEmpty()
  payment_method_types: string[];

  @ApiProperty({
    description: 'ID of the single-use mandate created, if any.',
    default: null,
  })
  @ValidateIf((_, value) => value)
  single_use_mandate: string | Stripe.Mandate | null;

  @ApiProperty({
    description: 'Status of the SetupIntent.',
    examples: ['requires_payment_method'],
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  status: Stripe.SetupIntent.Status;

  @ApiProperty({
    description: 'The usage type of the SetupIntent.',
    examples: ['off_session'],
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  usage: string;
}
