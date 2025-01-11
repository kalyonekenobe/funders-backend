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

export class StripePaymentMethodEntity implements Stripe.PaymentMethod {
  @ApiProperty({
    description: 'The unique identifier for the payment method.',
    examples: ['pm_1Q0PsIJvEtkwdCNYMSaVuRz6'],
    default: 'pm_1Q0PsIJvEtkwdCNYMSaVuRz6',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'The object type, which is always `payment_method`.',
    examples: ['payment_method'],
    default: 'payment_method',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  object: 'payment_method';

  @ApiProperty({
    description: 'ACSS Debit payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  acss_debit?: Stripe.PaymentMethod.AcssDebit | undefined;

  @ApiProperty({
    description: 'Affirm payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  affirm?: Stripe.PaymentMethod.Affirm | undefined;

  @ApiProperty({
    description: 'Afterpay Clearpay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  afterpay_clearpay?: Stripe.PaymentMethod.AfterpayClearpay | undefined;

  @ApiProperty({
    description: 'Alipay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  alipay?: Stripe.PaymentMethod.Alipay | undefined;

  @ApiProperty({
    description: 'Allow Redisplay details, if available.',
    examples: ['unspecified'],
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  allow_redisplay?: Stripe.PaymentMethod.AllowRedisplay | undefined;

  @ApiProperty({
    description: 'Alma payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  alma?: Stripe.PaymentMethod.Alma | undefined;

  @ApiProperty({
    description: 'Amazon Pay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  amazon_pay?: Stripe.PaymentMethod.AmazonPay | undefined;

  @ApiProperty({
    description: 'AU BECS Debit payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  au_becs_debit?: Stripe.PaymentMethod.AuBecsDebit | undefined;

  @ApiProperty({
    description: 'BACS Debit payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  bacs_debit?: Stripe.PaymentMethod.BacsDebit | undefined;

  @ApiProperty({
    description: 'Bancontact payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  bancontact?: Stripe.PaymentMethod.Bancontact | undefined;

  @ApiProperty({
    description: 'Billing details associated with the payment method.',
    default: {
      address: {
        city: null,
        country: null,
        line1: null,
        line2: null,
        postal_code: null,
        state: null,
      },
      email: null,
      name: 'John Doe',
      phone: null,
    },
  })
  @IsDefined()
  billing_details: Stripe.PaymentMethod.BillingDetails;

  @ApiProperty({
    description: 'BLIK payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  blik?: Stripe.PaymentMethod.Blik | undefined;

  @ApiProperty({
    description: 'Boleto payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  boleto?: Stripe.PaymentMethod.Boleto | undefined;

  @ApiProperty({
    description: 'Card payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  card?: Stripe.PaymentMethod.Card | undefined;

  @ApiProperty({
    description: 'Card Present payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  card_present?: Stripe.PaymentMethod.CardPresent | undefined;

  @ApiProperty({
    description: 'Cash App payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  cashapp?: Stripe.PaymentMethod.Cashapp | undefined;

  @ApiProperty({
    description: 'Timestamp when the payment method was created.',
    examples: [1726673582],
    default: 1726673582,
  })
  @IsNumber()
  @IsPositive()
  @IsDefined()
  created: number;

  @ApiProperty({
    description: 'The customer associated with this payment method.',
    examples: [null],
    default: null,
  })
  @ValidateIf((_, value) => value)
  customer: string | Stripe.Customer | null;

  @ApiProperty({
    description: 'Customer Balance payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  customer_balance?: Stripe.PaymentMethod.CustomerBalance | undefined;

  @ApiProperty({
    description: 'EPS payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  eps?: Stripe.PaymentMethod.Eps | undefined;

  @ApiProperty({
    description: 'FPX payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  fpx?: Stripe.PaymentMethod.Fpx | undefined;

  @ApiProperty({
    description: 'Giropay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  giropay?: Stripe.PaymentMethod.Giropay | undefined;

  @ApiProperty({
    description: 'GrabPay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  grabpay?: Stripe.PaymentMethod.Grabpay | undefined;

  @ApiProperty({
    description: 'iDEAL payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  ideal?: Stripe.PaymentMethod.Ideal | undefined;

  @ApiProperty({
    description: 'Interac Present payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  interac_present?: Stripe.PaymentMethod.InteracPresent | undefined;

  @ApiProperty({
    description: 'Kakao Pay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  kakao_pay?: Stripe.PaymentMethod.KakaoPay | undefined;

  @ApiProperty({
    description: 'Klarna payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  klarna?: Stripe.PaymentMethod.Klarna | undefined;

  @ApiProperty({
    description: 'Konbini payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  konbini?: Stripe.PaymentMethod.Konbini | undefined;

  @ApiProperty({
    description: 'KR Card payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  kr_card?: Stripe.PaymentMethod.KrCard | undefined;

  @ApiProperty({
    description: 'Link payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  link?: Stripe.PaymentMethod.Link | undefined;

  @ApiProperty({
    description: 'Whether this payment method is in live mode.',
    examples: [false],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  livemode: boolean;

  @ApiProperty({
    description: 'Metadata associated with the payment method.',
    default: {},
  })
  @ValidateIf((_, value) => value)
  metadata: Stripe.Metadata | null;

  @ApiProperty({
    description: 'MobilePay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  mobilepay?: Stripe.PaymentMethod.Mobilepay | undefined;

  @ApiProperty({
    description: 'Multibanco payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  multibanco?: Stripe.PaymentMethod.Multibanco | undefined;

  @ApiProperty({
    description: 'Naver Pay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  naver_pay?: Stripe.PaymentMethod.NaverPay | undefined;

  @ApiProperty({
    description: 'OXXO payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  oxxo?: Stripe.PaymentMethod.Oxxo | undefined;

  @ApiProperty({
    description: 'P24 payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  p24?: Stripe.PaymentMethod.P24 | undefined;

  @ApiProperty({
    description: 'Payco payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  payco?: Stripe.PaymentMethod.Payco | undefined;

  @ApiProperty({
    description: 'PayNow payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  paynow?: Stripe.PaymentMethod.Paynow | undefined;

  @ApiProperty({
    description: 'PayPal payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  paypal?: Stripe.PaymentMethod.Paypal | undefined;

  @ApiProperty({
    description: 'Pix payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  pix?: Stripe.PaymentMethod.Pix | undefined;

  @ApiProperty({
    description: 'PromptPay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  promptpay?: Stripe.PaymentMethod.Promptpay | undefined;

  @ApiProperty({
    description: 'Radar options, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  radar_options?: Stripe.PaymentMethod.RadarOptions | undefined;

  @ApiProperty({
    description: 'Revolut Pay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  revolut_pay?: Stripe.PaymentMethod.RevolutPay | undefined;

  @ApiProperty({
    description: 'Samsung Pay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  samsung_pay?: Stripe.PaymentMethod.SamsungPay | undefined;

  @ApiProperty({
    description: 'SEPA Debit payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  sepa_debit?: Stripe.PaymentMethod.SepaDebit | undefined;

  @ApiProperty({
    description: 'Sofort payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  sofort?: Stripe.PaymentMethod.Sofort | undefined;

  @ApiProperty({
    description: 'Swish payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  swish?: Stripe.PaymentMethod.Swish | undefined;

  @ApiProperty({
    description: 'Twint payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  twint?: Stripe.PaymentMethod.Twint | undefined;

  @ApiProperty({
    description: 'The type of the payment method.',
    examples: ['card'],
    default: 'card',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  type: Stripe.PaymentMethod.Type;

  @ApiProperty({
    description: 'US Bank Account payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  us_bank_account?: Stripe.PaymentMethod.UsBankAccount | undefined;

  @ApiProperty({
    description: 'WeChat Pay payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  wechat_pay?: Stripe.PaymentMethod.WechatPay | undefined;

  @ApiProperty({
    description: 'ZIP payment method details, if available.',
    default: undefined,
  })
  @ValidateIf((_, value) => value)
  zip?: Stripe.PaymentMethod.Zip | undefined;
}
