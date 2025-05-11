import { Module } from '@nestjs/common';
import { ChatController } from 'src/modules/chat/chat.controller';
import { ChatService } from 'src/modules/chat/chat.service';
import { ChatMessageModule } from 'src/modules/chat/submodules/chat-message/chat-message.module';
import { ChatRoleModule } from 'src/modules/chat/submodules/chat-role/chat-role.module';
import { ChatToUserModule } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.module';

@Module({
  imports: [ChatRoleModule, ChatToUserModule, ChatMessageModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
