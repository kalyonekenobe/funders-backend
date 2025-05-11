import { Module } from '@nestjs/common';
import { UserReportController } from 'src/modules/user/submodules/user-report/user-report.controller';
import { UserReportService } from 'src/modules/user/submodules/user-report/user-report.service';

@Module({
  controllers: [UserReportController],
  providers: [UserReportService],
  exports: [UserReportService],
})
export class UserReportModule {}
