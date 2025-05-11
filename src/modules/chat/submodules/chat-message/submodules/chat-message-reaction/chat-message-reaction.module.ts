import { Module } from '@nestjs/common';
import { ChatMessageReactionController } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/chat-message-reaction.controller';
import { ChatMessageReactionService } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/chat-message-reaction.service';

@Module({
  controllers: [ChatMessageReactionController],
  providers: [ChatMessageReactionService],
  exports: [ChatMessageReactionService],
})
export class ChatMessageReactionModule {}
