import { ApiProperty } from '@nestjs/swagger';
import { PostReactions } from '@prisma/client';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { PostReactionEntity } from 'src/modules/post/submodules/post-reaction/entities/post-reaction.entity';

export class CreatePostReactionDto
  implements
    Pick<PostReactionEntity, 'reaction'>,
    Pick<Partial<PostReactionEntity>, 'userId' | 'postId'>
{
  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Post uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsOptional()
  postId?: string;

  @ApiProperty({
    description: 'The reaction type of the post reaction',
    examples: Object.values(PostReactions),
    default: Object.values(PostReactions)[0],
  })
  @MaxLength(50)
  @IsEnum(PostReactions)
  @IsNotEmpty()
  @IsDefined()
  reaction: PostReactions;
}
