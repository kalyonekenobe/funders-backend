import { Module } from '@nestjs/common';
import { PostReactionController } from 'src/modules/post/submodules/post-reaction/post-reaction.controller';
import { PostReactionService } from 'src/modules/post/submodules/post-reaction/post-reaction.service';

@Module({
  controllers: [PostReactionController],
  providers: [PostReactionService],
  exports: [PostReactionService],
})
export class PostReactionModule {}
