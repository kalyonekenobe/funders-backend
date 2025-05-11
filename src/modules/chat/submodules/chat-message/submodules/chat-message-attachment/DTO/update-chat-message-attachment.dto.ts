import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateIf } from 'class-validator';
import { ChatMessageAttachmentEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/entities/chat-message-attachment.entity';

export class UpdateChatMessageAttachmentDto
  implements Pick<Partial<ChatMessageAttachmentEntity>, 'location' | 'filename'>
{
  @ApiProperty({
    description: 'The location of the chat message attachment',
    examples: ['https://supabase.com/funders/image.jpg'],
    default: 'https://supabase.com/funders/image.jpg',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  location?: string;

  @ApiProperty({
    description: 'Custom filename of the file of the chat message attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  filename?: string | null;
}
