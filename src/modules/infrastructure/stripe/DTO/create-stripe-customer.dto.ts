import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { Stripe } from 'stripe';

export class CreateStripeCustomerDto implements Stripe.CustomerCreateParams {
  @ApiProperty({
    description: 'The name of the stripe customer',
    examples: ['Petro Yaremenko', 'Oleksandr Igumnov', 'Illia Biloverbenko', 'Kyrylo Gorokhovsky'],
    default: 'Petro Yaremenko',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(100)
  @IsString()
  @ValidateIf((_, value) => value)
  name?: string;

  @ApiProperty({
    description: 'The email of the stripe customer',
    examples: [
      'petro.yaremenko@gmail.com',
      'oleksandr.igumnov@gmail.com',
      'illia.biloverbenko@gmail.com',
      'kyrylo.gorokhovsky@gmail.com',
    ],
    default: 'petro.yaremenko@gmail.com',
  })
  @MaxLength(50)
  @IsEmail()
  @ValidateIf((_, value) => value)
  email?: string;
}
