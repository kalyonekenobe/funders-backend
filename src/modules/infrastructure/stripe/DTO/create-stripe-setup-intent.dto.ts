import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined } from 'class-validator';

export class CreateStripeSetupIntentDto {
  @ApiProperty({
    description: 'The payment method types of the stripe setup intent',
    examples: [['card', 'link'], ['card']],
    default: ['card', 'link'],
  })
  @IsArray()
  @IsDefined()
  paymentMethodTypes?: string[];
}
