import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { ChatMessageAttachmentEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/entities/chat-message-attachment.entity';

export class CreateChatMessageAttachmentDto
  implements
    Pick<ChatMessageAttachmentEntity, 'messageId' | 'location'>,
    Pick<Partial<ChatMessageAttachmentEntity>, 'filename'>
{
  @ApiProperty({
    description: 'The uuid of chat message of the chat message attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  messageId: string;

  @ApiProperty({
    description: 'The location of the chat message attachment',
    examples: ['https://supabase.com/funders/image.jpg'],
    default: 'https://supabase.com/funders/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  location: string;

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
