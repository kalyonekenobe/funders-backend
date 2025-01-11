import { Module } from '@nestjs/common';
import { FollowingController } from 'src/modules/user/submodules/following/following.controller';
import { FollowingService } from 'src/modules/user/submodules/following/following.service';

@Module({
  controllers: [FollowingController],
  providers: [FollowingService],
})
export class FollowingModule {}
