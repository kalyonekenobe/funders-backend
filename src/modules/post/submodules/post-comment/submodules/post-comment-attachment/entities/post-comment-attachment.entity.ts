import { ApiProperty } from '@nestjs/swagger';
import { PostCommentAttachment } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxDate,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';

export class PostCommentAttachmentEntity implements PostCommentAttachment {
  @ApiProperty({
    description: 'The uuid of post comment attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'The uuid of post comment of the post comment attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  commentId: string;

  @ApiProperty({
    description: 'The filepath of post comment attachment',
    examples: [
      'post_comment_attachments/989d32c2-abd4-43d3-a420-ee175ae16b98.pptx',
      'post_comment_attachments/b7af9cd4-5533-4737-862b-78bce985c987.jpg',
      'post_comment_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
    ],
    default: 'post_comment_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
  })
  @IsString()
  @MaxLength(255)
  @IsDefined()
  location: string;

  @ApiProperty({
    description: 'Custom filename of the file of the post comment attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  filename: string | null;

  @ApiProperty({
    description: 'The date and time of creation of the post comment attachment',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time of updating of the post comment attachment',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'Nested comment object for this post comment attachment' })
  comment?: PostCommentEntity;
}
