import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PostCommentAttachmentEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/entities/post-comment-attachment.entity';

export class CreatePostCommentAttachmentDto
  implements
    Pick<PostCommentAttachmentEntity, 'location'>,
    Pick<Partial<PostCommentAttachmentEntity>, 'commentId' | 'filename'>
{
  @ApiProperty({
    description: 'The uuid of post comment of the post comment attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsOptional()
  commentId?: string;

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
  @IsNotEmpty()
  @IsDefined()
  location: string;

  @ApiProperty({
    description: 'Custom filename of the file of the post comment attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  filename?: string | null;
}
