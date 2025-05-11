import { ApiProperty } from '@nestjs/swagger';
import { ChatRoles } from '@prisma/client';
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
  ValidateIf,
} from 'class-validator';
import { ChatToUserEntity } from 'src/modules/chat/submodules/chat-to-user/entities/chat-to-user.entity';

export class CreateChatToUserDto
  implements
    Pick<ChatToUserEntity, 'userId' | 'role'>,
    Pick<Partial<ChatToUserEntity>, 'chatId' | 'lastSeenMessageTimestamp' | 'isArchived'>
{
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
    description: 'Chat uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @ValidateIf((_, value) => value)
  chatId?: string;

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
