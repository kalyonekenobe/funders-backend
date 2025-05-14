import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GeminiModuleOptions } from 'src/modules/infrastructure/gemini/types/gemini.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GeminiModuleOptions>().setClassMethodName('register').build();
