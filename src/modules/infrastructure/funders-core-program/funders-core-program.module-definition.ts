import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FundersCoreProgramModuleOptions } from 'src/modules/infrastructure/funders-core-program/types/funders-core-program.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FundersCoreProgramModuleOptions>()
    .setClassMethodName('register')
    .build();
