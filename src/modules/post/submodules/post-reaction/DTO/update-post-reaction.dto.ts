import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';
import { PostReactions } from '@prisma/client';
import { PostReactionEntity } from 'src/modules/post/submodules/post-reaction/entities/post-reaction.entity';

export class UpdatePostReactionDto implements Pick<Partial<PostReactionEntity>, 'reaction'> {
  @ApiProperty({
    description: 'The reaction type of the post reaction',
    examples: Object.values(PostReactions),
    default: Object.values(PostReactions)[0],
  })
  @MaxLength(50)
  @IsEnum(PostReactions)
  @IsOptional()
  reaction?: PostReactions;
}
