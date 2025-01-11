import { Module } from '@nestjs/common';
import { UserPenaltyController } from 'src/modules/user/submodules/user-penalty/user-penalty.controller';
import { UserPenaltyService } from 'src/modules/user/submodules/user-penalty/user-penalty.service';

@Module({
  controllers: [UserPenaltyController],
  providers: [UserPenaltyService],
})
export class UserPenaltyModule {}
