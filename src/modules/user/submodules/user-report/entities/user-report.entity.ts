import { ApiProperty } from '@nestjs/swagger';
import { $Enums, UserReport } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxDate,
  ValidateIf,
} from 'class-validator';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

export class UserReportEntity implements UserReport {
  @ApiProperty({
    description: 'The UUID of the report',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '57aef714-84bb-04c7-e751-7dea1411c7fe',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'The UUID of the reporter user',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  reporterId: string;

  @ApiProperty({
    description: 'The UUID of the reported user',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: 'The reason of the user report',
    examples: Object.values($Enums.UserReportReasons),
    default: Object.values($Enums.UserReportReasons)[0],
  })
  @IsEnum($Enums.UserReportReasons)
  @IsNotEmpty()
  @IsDefined()
  reason: $Enums.UserReportReasons;

  @ApiProperty({
    description: 'The status of the user report',
    examples: Object.values($Enums.UserReportStatuses),
    default: Object.values($Enums.UserReportStatuses)[0],
  })
  @IsEnum($Enums.UserReportStatuses)
  @IsNotEmpty()
  @IsDefined()
  status: $Enums.UserReportStatuses;

  @ApiProperty({
    description: 'The user penalty note',
    examples: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Eu consequat ac felis donec et odio pellentesque diam. Felis eget velit aliquet sagittis. In metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Eget nunc scelerisque viverra mauris in aliquam sem fringilla. Facilisi cras fermentum odio eu feugiat pretium nibh. Nisi porta lorem mollis aliquam ut porttitor leo. Viverra ipsum nunc aliquet bibendum. Urna porttitor rhoncus dolor purus non enim. Massa massa ultricies mi quis hendrerit dolor magna eget est.',
    ],
    default:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  note: string | null;

  @ApiProperty({
    description: 'User report creation date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'User report last updated date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: 'The reporter nested object for the user report' })
  reporter?: UserPublicEntity;

  @ApiProperty({ description: 'The user nested object for the user report' })
  user?: UserPublicEntity;
}
