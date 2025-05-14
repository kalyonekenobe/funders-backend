import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from 'src/modules/infrastructure/openai/openai.module-definition';
import { OpenAIService } from 'src/modules/infrastructure/openai/openai.service';

@Global()
@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule extends ConfigurableModuleClass {}
