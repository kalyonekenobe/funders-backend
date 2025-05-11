import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PostCommentReactionEntity } from '../entities/post-comment-reaction.entity';
import { PostCommentReactions } from '@prisma/client';

export class CreatePostCommentReactionDto
  implements
    Pick<PostCommentReactionEntity, 'reaction'>,
    Pick<Partial<PostCommentReactionEntity>, 'userId' | 'commentId'>
{
  @ApiProperty({
    description: 'Post comment uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsOptional()
  commentId?: string;

  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'The reaction type of the post comment reaction',
    examples: ['Like', 'Dislike', 'Crying', 'Heart', 'Laugh', 'Anger'],
    default: 'Like',
  })
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  reaction: PostCommentReactions;
}
