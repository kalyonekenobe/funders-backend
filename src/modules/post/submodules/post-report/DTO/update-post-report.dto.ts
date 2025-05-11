import { ApiProperty } from '@nestjs/swagger';
import { PostReportStatuses } from '@prisma/client';
import { IsEnum, ValidateIf } from 'class-validator';
import { PostReportEntity } from 'src/modules/post/submodules/post-report/entities/post-report.entity';

export class UpdatePostReportDto implements Pick<Partial<PostReportEntity>, 'status'> {
  @ApiProperty({
    description: 'The status of the post report',
    examples: Object.values(PostReportStatuses),
    default: Object.values(PostReportStatuses)[0],
  })
  @IsEnum(PostReportStatuses)
  @ValidateIf((_, value) => value)
  status?: PostReportStatuses;
}
