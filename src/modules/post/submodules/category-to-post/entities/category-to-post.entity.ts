import { ApiProperty } from '@nestjs/swagger';
import { CategoryToPost } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { PostCategoryEntity } from 'src/modules/post/submodules/post-category/entities/post-category.entity';

export class CategoryToPostEntity implements CategoryToPost {
  @ApiProperty({
    description: 'Post uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  postId: string;

  @ApiProperty({
    description: 'Name of the post category',
    examples: ['Army', 'Talents', 'Poor people', 'Animals'],
    default: 'Army',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  category: string;

  @ApiProperty({
    description: 'Category to post creation date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'Category to post last updated date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The nested post object for this CategoryToPostEntity' })
  post?: PostEntity;

  @ApiProperty({ description: 'The nested postCategory object for this CategoryToPostEntity' })
  postCategory?: PostCategoryEntity;
}
