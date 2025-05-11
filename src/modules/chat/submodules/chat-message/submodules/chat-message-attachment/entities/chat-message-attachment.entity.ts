import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageAttachment } from '@prisma/client';
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
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';

export class ChatMessageAttachmentEntity implements ChatMessageAttachment {
  @ApiProperty({
    description: 'The uuid of chat message attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

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
  filename: string | null;

  @ApiProperty({
    description: 'The date and time the chat message attachment was created',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the chat message attachment was updated',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-11-02'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'Nested message object for this chat message attachment' })
  message?: ChatMessageEntity;
}
