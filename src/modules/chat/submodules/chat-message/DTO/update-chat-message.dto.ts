import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageStatuses } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  ValidateIf,
} from 'class-validator';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { UpdateChatMessageAttachmentDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/DTO/update-chat-message-attachment.dto';

export class UpdateChatMessageDto
  implements Pick<Partial<ChatMessageEntity>, 'content' | 'isPinned' | 'status' | 'removedAt'>
{
  @ApiProperty({
    description: 'The text of the chat message',
    examples: ['Hi', 'Hello, world!', 'The first message'],
    default: 'The first message',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s<>]+$/gu)
  @IsString()
  @ValidateIf((_, value) => value)
  content?: string;

  @ApiProperty({
    description: 'Is the chat message pinned',
    examples: [false, true],
    default: false,
  })
  @IsBoolean()
  @ValidateIf((_, value) => value)
  isPinned?: boolean;

  @ApiProperty({
    description: 'The status of the chat message',
    examples: Object.values(ChatMessageStatuses),
    default: Object.values(ChatMessageStatuses)[0],
  })
  @IsEnum(ChatMessageStatuses)
  @IsOptional()
  status?: ChatMessageStatuses;

  @ApiProperty({
    description: 'The date and time the chat message was removed',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  removedAt?: Date | null;

  @ApiProperty({ description: 'The nested array of attachments of this chat message' })
  @ValidateIf((_, value) => value)
  attachments?: Pick<UpdateChatMessageAttachmentDto, 'location' | 'filename'>[];
}
