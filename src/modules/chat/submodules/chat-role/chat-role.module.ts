import { Module } from '@nestjs/common';
import { ChatRoleController } from 'src/modules/chat/submodules/chat-role/chat-role.controller';
import { ChatRoleService } from 'src/modules/chat/submodules/chat-role/chat-role.service';

@Module({
  controllers: [ChatRoleController],
  providers: [ChatRoleService],
})
export class ChatRoleModule {}
