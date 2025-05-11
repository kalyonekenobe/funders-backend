import { Module } from '@nestjs/common';
import { ChatToUserController } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.controller';
import { ChatToUserService } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.service';

@Module({
  controllers: [ChatToUserController],
  providers: [ChatToUserService],
})
export class ChatToUserModule {}
