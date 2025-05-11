import { Module } from '@nestjs/common';
import { PostCommentReportController } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/post-comment-report.controller';
import { PostCommentReportService } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/post-comment-report.service';

@Module({
  controllers: [PostCommentReportController],
  providers: [PostCommentReportService],
  exports: [PostCommentReportService],
})
export class PostCommentReportModule {}
