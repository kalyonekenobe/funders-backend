import { Module } from '@nestjs/common';
import { PostDonationController } from 'src/modules/post/submodules/post-donation/post-donation.controller';
import { PostDonationService } from 'src/modules/post/submodules/post-donation/post-donation.service';

@Module({
  controllers: [PostDonationController],
  providers: [PostDonationService],
  exports: [PostDonationService],
})
export class PostDonationModule {}
