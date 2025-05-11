import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { PostCategoryEntity } from 'src/modules/post/submodules/post-category/entities/post-category.entity';

export class CreatePostCategoryDto implements Pick<PostCategoryEntity, 'name'> {
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
  name: string;
}
