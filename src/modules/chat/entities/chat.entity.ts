import { ApiProperty } from '@nestjs/swagger';
import { Chat, ChatTypes } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { ChatToUserEntity } from 'src/modules/chat/submodules/chat-to-user/entities/chat-to-user.entity';

export class ChatEntity implements Chat {
  @ApiProperty({
    description: 'Chat uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'Name of the chat',
    examples: ['New chat', 'Chat', 'Friends'],
    default: 'Friends',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s]+$/gu)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  name: string | null;

  @ApiProperty({
    description: 'The type of the chat',
    examples: Object.values(ChatTypes),
    default: Object.values(ChatTypes)[0],
  })
  @IsEnum(ChatTypes)
  @IsNotEmpty()
  @IsDefined()
  type: ChatTypes;

  @ApiProperty({
    description: 'The description of the chat',
    examples: ['Students chat of Kyiv-Mohyla Academy', null],
    default: 'Students chat of Kyiv-Mohyla Academy',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  description: string | null;

  @ApiProperty({ description: 'The image of the chat' })
  @IsString()
  @ValidateIf((_, value) => value)
  image: string | null;

  @ApiProperty({
    description: 'Chat creation date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'Chat last updated date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The nested array of chat to user which have this chat' })
  chatsToUsers?: ChatToUserEntity[];

  @ApiProperty({ description: 'The nested array of messages which have this chat' })
  messages?: ChatMessageEntity[];
}
