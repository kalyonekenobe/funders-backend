import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageReaction, ChatMessageReactions } from '@prisma/client';
import { IsDate, IsDefined, IsEnum, IsNotEmpty, IsUUID, MaxDate, MaxLength } from 'class-validator';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

export class ChatMessageReactionEntity implements ChatMessageReaction {
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
    description: 'Message uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  messageId: string;

  @ApiProperty({
    description: 'The reaction type of the chat message reaction',
    examples: Object.values(ChatMessageReactions),
    default: Object.values(ChatMessageReactions)[0],
  })
  @MaxLength(50)
  @IsEnum(ChatMessageReactions)
  @IsNotEmpty()
  @IsDefined()
  reaction: ChatMessageReactions;

  @ApiProperty({
    description: 'The date and time of creation of the chat message reaction',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time of updating of the chat message reaction',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The nested object of user of this chat message reaction' })
  user?: UserPublicEntity;

  @ApiProperty({ description: 'The nested object of post of this chat message reaction' })
  chatMessage?: ChatMessageEntity;
}
