import { ApiProperty } from '@nestjs/swagger';
import { ChatRole, ChatRoles } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { ChatToUserEntity } from 'src/modules/chat/submodules/chat-to-user/entities/chat-to-user.entity';

export class ChatRoleEntity implements ChatRole {
  @ApiProperty({
    description: 'The name of the chat role',
    examples: ['User', 'Moderator', 'Administrator'],
    default: 'User',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: ChatRoles;

  @ApiProperty({
    description: 'The total value of chat role permissions',
    examples: [255, 15, 127, 31],
    default: 255,
  })
  @Max(2 ** 64 - 1)
  @IsNumber()
  @IsDefined()
  permissions: bigint;

  @ApiProperty({
    description: 'Chat role creation date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'Chat role last updated date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The nested array of chat to user which have this chat role' })
  chatsToUsers?: ChatToUserEntity[];
}
