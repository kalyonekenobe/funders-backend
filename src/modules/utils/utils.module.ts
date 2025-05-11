import { Module } from '@nestjs/common';
import { UtilsController } from 'src/modules/utils/utils.controller';
import { UtilsService } from 'src/modules/utils/utils.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
