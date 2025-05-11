import { Module } from '@nestjs/common';
import { PostReportController } from 'src/modules/post/submodules/post-report/post-report.controller';
import { PostReportService } from 'src/modules/post/submodules/post-report/post-report.service';

@Module({
  controllers: [PostReportController],
  providers: [PostReportService],
  exports: [PostReportService],
})
export class PostReportModule {}
