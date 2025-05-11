import { ApiProperty } from '@nestjs/swagger';
import { PostCommentReaction, PostCommentReactions } from '@prisma/client';
import { IsDate, IsDefined, IsEnum, IsNotEmpty, IsUUID, MaxDate, MaxLength } from 'class-validator';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

export class PostCommentReactionEntity implements PostCommentReaction {
  @ApiProperty({
    description: 'Post comment uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  commentId: string;

  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: 'The reaction type of the post comment reaction',
    examples: ['Like', 'Dislike', 'Crying', 'Heart', 'Laugh', 'Anger'],
    default: 'Like',
  })
  @MaxLength(50)
  @IsEnum(PostCommentReactions)
  @IsNotEmpty()
  @IsDefined()
  reaction: PostCommentReactions;

  @ApiProperty({
    description: 'The date and time of creation of the post comment reaction',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time of updating of the post comment reaction',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The nested object of user of this post comment reaction' })
  user?: UserPublicEntity;

  @ApiProperty({ description: 'The nested object of post comment of this post comment reaction' })
  comment?: PostCommentEntity;
}
