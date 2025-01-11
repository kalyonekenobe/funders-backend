import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/infrastructure/prisma/prisma.module';
import { ChatRoleController } from './chat-role.controller';
import { ChatRoleService } from './chat-role.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatRoleController],
  providers: [ChatRoleService],
  exports: [ChatRoleService],
})
export class ChatRoleModule {}
