import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { MODULE_OPTIONS_TOKEN } from 'src/modules/infrastructure/openai/openai.module-definition';
import { OpenAIModuleOptions } from 'src/modules/infrastructure/openai/types/openai.types';

@Injectable()
export class OpenAIService extends OpenAI {
  private readonly model: string;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: OpenAIModuleOptions) {
    super({ apiKey: options.apiKey });
    this.model = options.model;
  }

  public async ask(
    prompt: string,
    systemMessage?: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    return this.chat.completions.create({
      messages: [
        ...(systemMessage
          ? [{ role: 'system', content: systemMessage } as ChatCompletionMessageParam]
          : []),
        { role: 'user', content: prompt },
      ],
      model: this.model,
    });
  }
}
