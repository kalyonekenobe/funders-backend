import { Module } from '@nestjs/common';
import { ChatController } from 'src/modules/chat/chat.controller';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { ChatService } from 'src/modules/chat/chat.service';
import { ChatMessageModule } from 'src/modules/chat/submodules/chat-message/chat-message.module';
import { ChatRoleModule } from 'src/modules/chat/submodules/chat-role/chat-role.module';
import { ChatToUserModule } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.module';
import { ChatToUserService } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.service';

@Module({
  imports: [ChatRoleModule, ChatToUserModule, ChatMessageModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatToUserService],
})
export class ChatModule {}
