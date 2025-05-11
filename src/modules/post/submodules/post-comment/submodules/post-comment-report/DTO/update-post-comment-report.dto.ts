import { ApiProperty } from '@nestjs/swagger';
import { PostCommentReportStatuses } from '@prisma/client';
import { IsEnum, ValidateIf } from 'class-validator';
import { PostCommentReportEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/entities/post-comment-report.entity';

export class UpdatePostCommentReportDto
  implements Pick<Partial<PostCommentReportEntity>, 'status'>
{
  @ApiProperty({
    description: 'The status of the post comment report',
    examples: Object.values(PostCommentReportStatuses),
    default: Object.values(PostCommentReportStatuses)[0],
  })
  @IsEnum(PostCommentReportStatuses)
  @ValidateIf((_, value) => value)
  status?: PostCommentReportStatuses;
}
