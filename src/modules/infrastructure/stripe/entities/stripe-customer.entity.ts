import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Stripe } from 'stripe';

export class StripeCustomerEntity implements Stripe.Customer {
  @ApiProperty({
    description: 'The id of the stripe customer',
    examples: ['cus_RNX1jeFf4oXvk3'],
    default: 'cus_RNX1jeFf4oXvk3',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'The object name of the stripe customer',
    examples: ['customer'],
    default: 'customer',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  object: 'customer';

  @ApiProperty({
    description: 'The address of the stripe customer',
    default: null,
  })
  @ValidateIf((_, value) => value)
  address?: Stripe.Address | null | undefined;

  @ApiProperty({
    description: 'The balance of the stripe customer',
    examples: [0, 14515],
    default: 0,
  })
  @IsNumber()
  @IsDefined()
  balance: number;

  @ApiProperty({
    description: 'The cash balance of the stripe customer',
    default: null,
  })
  @ValidateIf((_, value) => value)
  cash_balance?: Stripe.CashBalance | null | undefined;

  @ApiProperty({
    description: 'The created timestamp of the stripe customer',
    examples: [1680893993, 1660581761],
    default: 1680893993,
  })
  @IsNumber()
  @IsDefined()
  created: number;

  @ApiProperty({
    description: 'The currency of the stripe customer',
    examples: ['USD', null],
    default: 'USD',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  currency?: string | null | undefined;

  @ApiProperty({
    description: 'The default source of the stripe customer',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  default_source: string | Stripe.CustomerSource | null;

  @ApiProperty({
    description: 'The is deleted flag of the stripe customer',
    examples: [undefined],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  deleted?: any | undefined;

  @ApiProperty({
    description: 'The is delinquent flag of the stripe customer',
    examples: [true, false, null, undefined],
    default: false,
  })
  @IsBoolean()
  @ValidateIf((_, value) => value)
  delinquent?: boolean | null | undefined;

  @ApiProperty({
    description: 'The is description flag of the stripe customer',
    examples: [null],
    default: null,
  })
  @IsString()
  @ValidateIf((_, value) => value)
  description: string | null;

  @ApiProperty({
    description: 'The discount of the stripe customer',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  discount?: Stripe.Discount | null | undefined;

  @ApiProperty({
    description: 'The email of the stripe customer',
    examples: ['jennyrosen@example.com'],
    default: 'jennyrosen@example.com',
  })
  @IsEmail()
  @ValidateIf((_, value) => value)
  email: string | null;

  @ApiProperty({
    description: 'The invoice credit balance of the stripe customer',
    examples: [undefined],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  invoice_credit_balance?: { [key: string]: number } | undefined;

  @ApiProperty({
    description: 'The invoice prefix of the stripe customer',
    examples: ['0759376C', null],
    default: '0759376C',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  invoice_prefix?: string | null | undefined;

  @ApiProperty({
    description: 'The invoice settings of the stripe customer',
    default: {
      custom_fields: null,
      default_payment_method: null,
      footer: null,
      rendering_options: null,
    },
  })
  @ValidateIf((_, value) => value)
  invoice_settings: Stripe.Customer.InvoiceSettings;

  @ApiProperty({
    description: 'The livemode flag of the stripe customer',
    examples: [true, false],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  livemode: boolean;

  @ApiProperty({
    description: 'The metadata of the stripe customer',
    default: {},
  })
  @IsDefined()
  metadata: Stripe.Metadata;

  @ApiProperty({
    description: 'The name of the stripe customer',
    examples: ['Jenny Rosen'],
    default: 'Jenny Rosen',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  name?: string | null | undefined;

  @ApiProperty({
    description: 'The next invoice sequence of the stripe customer',
    examples: [1],
    default: 1,
  })
  @IsNumber()
  @ValidateIf((_, value) => value)
  next_invoice_sequence?: number | undefined;

  @ApiProperty({
    description: 'The phone number of the stripe customer',
    examples: [null, '+380965052211'],
    default: null,
  })
  @IsPhoneNumber()
  @ValidateIf((_, value) => value)
  phone?: string | null | undefined;

  @ApiProperty({
    description: 'The preferred locales of the stripe customer',
    examples: [[]],
    default: [],
  })
  @IsArray()
  @ValidateIf((_, value) => value)
  preferred_locales?: string[] | null | undefined;

  @ApiProperty({
    description: 'The shipping of the stripe customer',
    examples: [null],
    default: null,
  })
  @IsDefined()
  shipping: Stripe.Customer.Shipping | null;

  @ApiProperty({
    description: 'The sources of the stripe customer',
    examples: [undefined, []],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  sources?: Stripe.ApiList<Stripe.CustomerSource> | undefined;

  @ApiProperty({
    description: 'The subscriptions of the stripe customer',
    examples: [undefined, []],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  subscriptions?: Stripe.ApiList<Stripe.Subscription> | undefined;

  @ApiProperty({
    description: 'The tax of the stripe customer',
    examples: [undefined],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  tax?: Stripe.Customer.Tax | undefined;

  @ApiProperty({
    description: 'The tax exepmt of the stripe customer',
    examples: ['reverse', 'exempt', 'none', null, undefined],
    default: 'none',
  })
  @ValidateIf((_, value) => value)
  tax_exempt?: Stripe.Customer.TaxExempt | null | undefined;

  @ApiProperty({
    description: 'The tax ids list of the stripe customer',
    examples: [undefined, ['tid_JGYfj17g85h']],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  tax_ids?: Stripe.ApiList<Stripe.TaxId> | undefined;

  @ApiProperty({
    description: 'The test clock of the stripe customer',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  test_clock?: string | Stripe.TestHelpers.TestClock | null | undefined;
}
