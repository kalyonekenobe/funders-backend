import { ConfigurableModuleBuilder } from '@nestjs/common';
import { OpenAIModuleOptions } from 'src/modules/infrastructure/openai/types/openai.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<OpenAIModuleOptions>().setClassMethodName('register').build();
