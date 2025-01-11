import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginWithGoogleDto {
  @ApiProperty({
    description: 'Google access token',
    examples: ['2l4IQtZXbn5WBJdL6EF7uenOWRsi'],
    default: '2l4IQtZXbn5WBJdL6EF7uenOWRsi',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  googleAccessToken: string;
}
