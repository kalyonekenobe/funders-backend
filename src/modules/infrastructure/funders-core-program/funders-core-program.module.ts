import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from 'src/modules/infrastructure/funders-core-program/funders-core-program.module-definition';
import { FundersCoreProgramService } from 'src/modules/infrastructure/funders-core-program/funders-core-program.service';

@Global()
@Module({
  providers: [FundersCoreProgramService],
  exports: [FundersCoreProgramService],
})
export class FundersCoreProgramModule extends ConfigurableModuleClass {}
