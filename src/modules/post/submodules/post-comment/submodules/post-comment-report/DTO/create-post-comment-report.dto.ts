import { ApiProperty } from '@nestjs/swagger';
import { PostCommentReportReasons } from '@prisma/client';
import { IsDefined, IsEnum, IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';
import { PostCommentReportEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/entities/post-comment-report.entity';

export class CreatePostCommentReportDto
  implements
    Pick<PostCommentReportEntity, 'postCommentId' | 'reason'>,
    Pick<Partial<PostCommentReportEntity>, 'reporterId' | 'note'>
{
  @ApiProperty({
    description: 'The UUID of the reporter user',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  reporterId?: string;

  @ApiProperty({
    description: 'The UUID of the reported post comment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  postCommentId: string;

  @ApiProperty({
    description: 'The reason of the post comment report',
    examples: Object.values(PostCommentReportReasons),
    default: Object.values(PostCommentReportReasons)[0],
  })
  @IsEnum(PostCommentReportReasons)
  @IsNotEmpty()
  @IsDefined()
  reason: PostCommentReportReasons;

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
  note?: string | null;
}
