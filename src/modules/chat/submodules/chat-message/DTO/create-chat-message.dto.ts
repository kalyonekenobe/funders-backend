import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsUUID, Matches, ValidateIf } from 'class-validator';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { CreateChatMessageAttachmentDto } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/DTO/create-chat-message-attachment.dto';

export class CreateChatMessageDto
  implements
    Pick<ChatMessageEntity, 'content'>,
    Pick<Partial<ChatMessageEntity>, 'chatId' | 'authorId' | 'parentMessageId'>
{
  @ApiProperty({
    description: 'The uuid of the chat',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @ValidateIf((_, value) => value)
  chatId?: string;

  @ApiProperty({
    description: "Author's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @ValidateIf((_, value) => value)
  authorId?: string;

  @ApiProperty({
    description: 'Parent chat message uuid',
    examples: [
      'jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz',
      'fj5mgsq4-jjf1-49g1-a031-9941ng1ancag8h7m',
    ],
    default: 'fj5mgsq4-jjf1-49g1-a031-9941ng1ancag8h7m',
  })
  @IsUUID()
  @ValidateIf((_, value) => value)
  parentMessageId?: string | null;

  @ApiProperty({
    description: 'The text of the chat message',
    examples: ['Hi', 'Hello, world!', 'The first message'],
    default: 'The first message',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s<>]+$/gu)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  content: string;

  @ApiProperty({ description: 'The nested array of attachments of this chat message' })
  @ValidateIf((_, value) => value)
  attachments?: Pick<CreateChatMessageAttachmentDto, 'location' | 'filename'>[];
}
