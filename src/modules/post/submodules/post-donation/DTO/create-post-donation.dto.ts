import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { IsNumber, IsDefined, IsNotEmpty, IsString, Min } from 'class-validator';
import { PostDonationEntity } from 'src/modules/post/submodules/post-donation/entities/post-donation.entity';

export class CreatePostDonationDto implements Pick<PostDonationEntity, 'details' | 'amount'> {
  @ApiProperty({
    description: 'The payment info of the post donation',
    examples: ['{ "last4": "4242" }', '{ "last4": "5167" }', '{ "last4": "9914" }'],
    default: '{ "last4": "4242" }',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  details: string;

  @ApiProperty({
    description: 'The amount of money of the donation',
    examples: [1551.6, 1000.0, 8500.5],
    default: 8500.5,
  })
  @Min(0.01)
  @IsNumber()
  @Type(() => Prisma.Decimal)
  @IsDefined()
  amount: Decimal;
}
