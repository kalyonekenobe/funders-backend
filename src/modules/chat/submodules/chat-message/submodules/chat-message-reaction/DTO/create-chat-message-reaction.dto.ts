import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageReactions } from '@prisma/client';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ChatMessageReactionEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/entities/chat-message-reaction.entity';

export class CreateChatMessageReactionDto
  implements
    Pick<ChatMessageReactionEntity, 'reaction'>,
    Pick<Partial<ChatMessageReactionEntity>, 'messageId' | 'userId'>
{
  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Message uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsOptional()
  messageId?: string;

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
}
