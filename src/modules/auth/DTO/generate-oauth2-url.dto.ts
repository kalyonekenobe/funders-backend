import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { OAuth2Payload } from 'src/modules/auth/types/auth.types';

export class GenerateOAuth2UrlDto implements OAuth2Payload {
  @ApiProperty({
    description: 'The url from which the request was sent',
    examples: ['http://localhost:3000'],
    default: 'http://localhost:3000',
  })
  @IsNotEmpty()
  @IsDefined()
  referer: string;
}
