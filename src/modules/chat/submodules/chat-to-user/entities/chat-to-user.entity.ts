import { ApiProperty } from '@nestjs/swagger';
import { ChatRoles, ChatToUser } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import { ChatRoleEntity } from 'src/modules/chat/submodules/chat-role/entities/chat-role.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

export class ChatToUserEntity implements ChatToUser {
  @ApiProperty({
    description: 'Chat uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  chatId: string;

  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: 'The role of the user in the chat',
    examples: ['User', 'Moderator', 'Administrator'],
    default: 'User',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  role: ChatRoles;

  @ApiProperty({
    description: 'The is archived flag of the user to chat',
    examples: [true, false],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  isArchived: boolean;

  @ApiProperty({
    description: 'Chat to user last seen message date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  lastSeenMessageTimestamp: Date;

  @ApiProperty({
    description: 'Chat to user creation date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'Chat to user last updated date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The nested object of chat of this chat to user entity' })
  chat?: ChatEntity;

  @ApiProperty({ description: 'The nested object of user of this chat to user entity' })
  user?: UserPublicEntity;

  @ApiProperty({ description: 'The nested object of chat role of this chat to user entity' })
  chatRole?: ChatRoleEntity;
}
