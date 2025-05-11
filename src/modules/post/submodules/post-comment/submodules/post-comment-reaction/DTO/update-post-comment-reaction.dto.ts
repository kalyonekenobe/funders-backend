import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PostCommentReactionEntity } from '../entities/post-comment-reaction.entity';
import { PostCommentReactions } from '@prisma/client';

export class UpdatePostCommentReactionDto
  implements Pick<Partial<PostCommentReactionEntity>, 'reaction'>
{
  @ApiProperty({
    description: 'The reaction type of the post comment reaction',
    examples: ['Like', 'Dislike', 'Crying', 'Heart', 'Laugh', 'Anger'],
    default: 'Like',
  })
  @MaxLength(50)
  @IsString()
  @IsOptional()
  reaction?: PostCommentReactions;
}
