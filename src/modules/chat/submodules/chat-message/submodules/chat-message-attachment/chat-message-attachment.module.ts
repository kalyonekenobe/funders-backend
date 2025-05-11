import { Module } from '@nestjs/common';
import { ChatMessageAttachmentController } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/chat-message-attachment.controller';
import { ChatMessageAttachmentService } from 'src/modules/chat/submodules/chat-message/submodules/chat-message-attachment/chat-message-attachment.service';

@Module({
  controllers: [ChatMessageAttachmentController],
  providers: [ChatMessageAttachmentService],
  exports: [ChatMessageAttachmentService],
})
export class ChatMessageAttachmentModule {}
