import { ConfigurableModuleBuilder } from '@nestjs/common';
import { StripeModuleOptions } from 'src/modules/infrastructure/stripe/types/stripe.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<StripeModuleOptions>().setClassMethodName('register').build();
