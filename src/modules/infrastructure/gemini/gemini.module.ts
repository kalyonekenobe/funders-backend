import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from 'src/modules/infrastructure/gemini/gemini.module-definition';
import { GeminiService } from 'src/modules/infrastructure/gemini/gemini.service';

@Global()
@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule extends ConfigurableModuleClass {}
