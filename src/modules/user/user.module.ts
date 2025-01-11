import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FollowingModule } from 'src/modules/user/submodules/following/following.module';
import { UserRoleModule } from 'src/modules/user/submodules/user-role/user-role.module';
import { UserPenaltyModule } from 'src/modules/user/submodules/user-penalty/user-penalty.module';
import { UserReportModule } from 'src/modules/user/submodules/user-report/user-report.module';

@Module({
  imports: [FollowingModule, UserRoleModule, UserPenaltyModule, UserReportModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
