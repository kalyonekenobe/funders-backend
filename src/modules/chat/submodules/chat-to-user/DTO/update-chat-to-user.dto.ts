import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ChatToUserEntity } from '../entities/chat-to-user.entity';
import { ChatRoles } from '@prisma/client';

export class UpdateChatToUserDto
  implements Pick<Partial<ChatToUserEntity>, 'role' | 'lastSeenMessageTimestamp' | 'isArchived'>
{
  @ApiProperty({
    description: 'The role of the user in the chat',
    examples: ['User', 'Moderator', 'Administrator'],
    default: 'User',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  role?: ChatRoles;

  @ApiProperty({
    description: 'The is archived flag of the user to chat',
    examples: [true, false],
    default: false,
  })
  @IsBoolean()
  @ValidateIf((_, value) => value)
  isArchived?: boolean;

  @ApiProperty({
    description: 'Chat to user last seen message date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @ValidateIf((_, value) => value)
  lastSeenMessageTimestamp?: Date;
}
