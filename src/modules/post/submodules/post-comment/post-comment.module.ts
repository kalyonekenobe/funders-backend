import { Module } from '@nestjs/common';
import { PostCommentController } from 'src/modules/post/submodules/post-comment/post-comment.controller';
import { PostCommentService } from 'src/modules/post/submodules/post-comment/post-comment.service';
import { PostCommentAttachmentModule } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/post-comment-attachment.module';
import { PostCommentReactionModule } from 'src/modules/post/submodules/post-comment/submodules/post-comment-reaction/post-comment-reaction.module';
import { PostCommentReportModule } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/post-comment-report.module';

@Module({
  imports: [PostCommentReactionModule, PostCommentAttachmentModule, PostCommentReportModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
  exports: [PostCommentService],
})
export class PostCommentModule {}
