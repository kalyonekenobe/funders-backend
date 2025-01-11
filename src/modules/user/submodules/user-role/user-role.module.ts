import { Module } from '@nestjs/common';
import { UserRoleController } from 'src/modules/user/submodules/user-role/user-role.controller';
import { UserRoleService } from 'src/modules/user/submodules/user-role/user-role.service';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService],
})
export class UserRoleModule {}
