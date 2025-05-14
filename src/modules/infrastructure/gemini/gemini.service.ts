import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from 'src/modules/infrastructure/gemini/gemini.module-definition';
import { GeminiModuleOptions } from 'src/modules/infrastructure/gemini/types/gemini.types';

@Injectable()
export class GeminiService extends GoogleGenAI {
  private readonly model: string;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: GeminiModuleOptions) {
    super({ apiKey: options.apiKey });
    this.model = options.model;
  }

  public async ask(prompt: string, systemMessage?: string): Promise<GenerateContentResponse> {
    console.log(
      systemMessage
        ? `ATTENTION, SYSTEM MESSAGE FOR YOU:
    ${systemMessage}
    
    USER MESSAGE:
    ${prompt}`
        : prompt,
    );
    return this.models.generateContent({
      model: this.model,
      contents: systemMessage
        ? `ATTENTION, SYSTEM MESSAGE FOR YOU:
      ${systemMessage}
      
      USER MESSAGE:
      ${prompt}
      `
        : prompt,
    });
  }

  public async checkForSpamOrInsultingContent(content: string): Promise<boolean> {
    const systemMessage = `You are a strict content moderation assistant. Your job is to detect whether a message contains any spammy, nonsensical, offensive, or harmful segments.
The message may contain normal text at the beginning or end, but if any part of it is spammy, meaningless, offensive, or harmful, return only the word True. Otherwise, return False.
Respond with only one word: True or False. No extra text, explanation, or punctuation.
Example of spammy content: text with random characters, gibberish, excessive repetition, or mixed junk inside otherwise valid content.
    `;

    const completion = await this.ask(`Content to sanitize: "${content}"`, systemMessage);
    const response = completion.text?.toLowerCase()?.trim();

    return response === 'true';
  }
}
