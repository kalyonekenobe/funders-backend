import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Prisma } from '@prisma/client';
import { PostDonationEntity } from 'src/modules/post/submodules/post-donation/entities/post-donation.entity';

export class UpdatePostDonationDto
  implements Pick<Partial<PostDonationEntity>, 'details' | 'amount'>
{
  @ApiProperty({
    description: 'The payment info of the post donation',
    examples: ['{ "last4": "4242" }', '{ "last4": "5167" }', '{ "last4": "9914" }'],
    default: '{ "last4": "4242" }',
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({
    description: 'The amount of money of the donation',
    examples: [1551.6, 1000.0, 8500.5],
    default: 8500.5,
  })
  @Min(0.01)
  @IsNumber()
  @Type(() => Prisma.Decimal)
  @IsOptional()
  donation?: Prisma.Decimal;
}
