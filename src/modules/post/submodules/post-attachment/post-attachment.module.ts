import { Module } from '@nestjs/common';
import { PostAttachmentController } from 'src/modules/post/submodules/post-attachment/post-attachment.controller';
import { PostAttachmentService } from 'src/modules/post/submodules/post-attachment/post-attachment.service';

@Module({
  controllers: [PostAttachmentController],
  providers: [PostAttachmentService],
  exports: [PostAttachmentService],
})
export class PostAttachmentModule {}
