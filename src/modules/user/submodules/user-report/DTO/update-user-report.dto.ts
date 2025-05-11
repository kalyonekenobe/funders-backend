import { ApiProperty } from '@nestjs/swagger';
import { UserReportStatuses } from '@prisma/client';
import { IsEnum, ValidateIf } from 'class-validator';
import { UserReportEntity } from 'src/modules/user/submodules/user-report/entities/user-report.entity';

export class UpdateUserReportDto implements Pick<Partial<UserReportEntity>, 'status'> {
  @ApiProperty({
    description: 'The status of the user report',
    examples: Object.values(UserReportStatuses),
    default: Object.values(UserReportStatuses)[0],
  })
  @IsEnum(UserReportStatuses)
  @ValidateIf((_, value) => value)
  status?: UserReportStatuses;
}
