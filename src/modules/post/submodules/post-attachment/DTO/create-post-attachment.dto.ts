import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PostAttachmentEntity } from 'src/modules/post/submodules/post-attachment/entities/post-attachment.entity';

export class CreatePostAttachmentDto
  implements
    Pick<PostAttachmentEntity, 'location'>,
    Pick<Partial<PostAttachmentEntity>, 'filename' | 'postId'>
{
  @ApiProperty({
    description: 'The uuid of post of the post attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsOptional()
  postId?: string;

  @ApiProperty({
    description: 'The filepath of post attachment',
    examples: [
      'post_attachments/989d32c2-abd4-43d3-a420-ee175ae16b98.pptx',
      'post_attachments/b7af9cd4-5533-4737-862b-78bce985c987.jpg',
      'post_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
    ],
    default: 'post_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
  })
  @IsString()
  @MaxLength(255)
  @IsDefined()
  location: string;

  @ApiProperty({
    description: 'Custom filename of the file of the post attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  filename?: string | null;
}
