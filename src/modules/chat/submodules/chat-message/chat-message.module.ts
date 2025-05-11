import { Module } from '@nestjs/common';
import { ChatMessageController } from 'src/modules/chat/submodules/chat-message/chat-message.controller';
import { ChatMessageService } from 'src/modules/chat/submodules/chat-message/chat-message.service';
import { ChatMessageAttachmentModule } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/chat-message-attachment.module';
import { ChatMessageReactionModule } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-reaction/chat-message-reaction.module';

@Module({
  imports: [ChatMessageAttachmentModule, ChatMessageReactionModule],
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
