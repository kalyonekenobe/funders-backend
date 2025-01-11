import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginWithDiscordDto {
  @ApiProperty({
    description: 'Discord access token',
    examples: ['6qrZcUqja7812RVdnEKjpzOL4CvHBFG'],
    default: '6qrZcUqja7812RVdnEKjpzOL4CvHBFG',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  discordAccessToken: string;
}
