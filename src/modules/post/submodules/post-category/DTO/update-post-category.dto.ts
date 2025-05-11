import { ApiProperty } from '@nestjs/swagger';
import { PostCategoryEntity } from '../entities/post-category.entity';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdatePostCategoryDto implements Pick<Partial<PostCategoryEntity>, 'name'> {
  @ApiProperty({
    description: 'Name of the post category',
    examples: ['Army', 'Talents', 'Poor people', 'Animals'],
    default: 'Army',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  name?: string;
}
