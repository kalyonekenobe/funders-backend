import { ApiProperty } from '@nestjs/swagger';
import { ChatRoles } from '@prisma/client';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';
import { ChatRoleEntity } from 'src/modules/chat/submodules/chat-role/entities/chat-role.entity';

export class CreateChatRoleDto implements Pick<ChatRoleEntity, 'name' | 'permissions'> {
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
}
