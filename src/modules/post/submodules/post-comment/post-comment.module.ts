import { Module } from '@nestjs/common';
import { PostCommentController } from 'src/modules/post/submodules/post-comment/post-comment.controller';
import { PostCommentService } from 'src/modules/post/submodules/post-comment/post-comment.service';
import { PostCommentAttachmentModule } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/post-comment-attachment.module';
import { PostCommentReactionModule } from 'src/modules/post/submodules/post-comment/submodules/post-comment-reaction/post-comment-reaction.module';

@Module({
  imports: [PostCommentReactionModule, PostCommentAttachmentModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
