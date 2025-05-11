import { Module } from '@nestjs/common';
import { PostCommentReactionController } from './post-comment-reaction.controller';
import { PostCommentReactionService } from './post-comment-reaction.service';

@Module({
  controllers: [PostCommentReactionController],
  providers: [PostCommentReactionService],
  exports: [PostCommentReactionService],
})
export class PostCommentReactionModule {}
