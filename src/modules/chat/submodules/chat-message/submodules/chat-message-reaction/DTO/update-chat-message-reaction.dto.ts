import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageReactions } from '@prisma/client';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ChatMessageReactionEntity } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/entities/chat-message-reaction.entity';

export class UpdateChatMessageReactionDto
  implements Pick<Partial<ChatMessageReactionEntity>, 'reaction'>
{
  @ApiProperty({
    description: 'The reaction type of the chat message reaction',
    examples: Object.values(ChatMessageReactions),
    default: Object.values(ChatMessageReactions)[0],
  })
  @MaxLength(50)
  @IsEnum(ChatMessageReactions)
  @IsOptional()
  reaction?: ChatMessageReactions;
}
