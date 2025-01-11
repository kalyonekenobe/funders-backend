import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, ValidateIf } from 'class-validator';
import { UserReportEntity } from 'src/modules/user/submodules/user-report/entities/user-report.entity';

export class UpdateUserReportDto implements Pick<Partial<UserReportEntity>, 'status'> {
  @ApiProperty({
    description: 'The status of the user report',
    examples: Object.values($Enums.UserReportStatuses),
    default: Object.values($Enums.UserReportStatuses)[0],
  })
  @IsEnum($Enums.UserReportStatuses)
  @ValidateIf((_, value) => value)
  status?: $Enums.UserReportStatuses;
}
