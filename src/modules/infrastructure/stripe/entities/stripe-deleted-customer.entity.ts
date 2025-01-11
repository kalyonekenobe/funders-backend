import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Stripe } from 'stripe';

export class StripeDeletedCustomerEntity implements Stripe.DeletedCustomer {
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
    description: 'The is deleted flag of the stripe customer',
    examples: [true, false],
    default: true,
  })
  @IsBoolean()
  @IsDefined()
  deleted: true;
}
