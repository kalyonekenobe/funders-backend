import { Module } from '@nestjs/common';
import { PostCommentAttachmentController } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/post-comment-attachment.controller';
import { PostCommentAttachmentService } from 'src/modules/post/submodules/post-comment/submodules/post-comment-attachment/post-comment-attachment.service';

@Module({
  controllers: [PostCommentAttachmentController],
  providers: [PostCommentAttachmentService],
  exports: [PostCommentAttachmentService],
})
export class PostCommentAttachmentModule {}
