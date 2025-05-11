import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { ChatTypes } from '@prisma/client';
import { CreateChatToUserDto } from 'src/modules/chat/submodules/chat-to-user/DTO/create-chat-to-user.dto';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';

export class CreateChatDto
  implements Pick<Partial<ChatEntity>, 'name' | 'type' | 'description' | 'image'>
{
  @ApiProperty({
    description: 'Name of the chat',
    examples: ['New chat', 'Chat', 'Friends'],
    default: 'Friends',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s]+$/gu)
  @MaxLength(255)
  @IsString()
  @ValidateIf((_, value) => value !== null)
  name?: string | null;

  @ApiProperty({
    description: 'The type of the chat',
    examples: Object.values(ChatTypes),
    default: Object.values(ChatTypes)[0],
  })
  @IsEnum(ChatTypes)
  type?: ChatTypes;

  @ApiProperty({
    description: 'The description of the chat',
    examples: ['Students chat of Kyiv-Mohyla Academy', null],
    default: 'Students chat of Kyiv-Mohyla Academy',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  description?: string | null;

  @ApiProperty({ description: 'The image of the chat' })
  @IsString()
  @ValidateIf((_, value) => value)
  image?: string | null;

  @ApiProperty({ description: 'The nested array of chat to user which have this chat' })
  @ValidateIf((_, value) => value)
  chatsToUsers?: CreateChatToUserDto[];
}
