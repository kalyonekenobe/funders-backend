import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreatePostCommentReportDto } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/DTO/create-post-comment-report.dto';
import { UpdatePostCommentReportDto } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/DTO/update-post-comment-report.dto';
import { PostCommentReportEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-report/entities/post-comment-report.entity';

@Injectable()
export class PostCommentReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(
    options?: Prisma.PostCommentReportFindManyArgs,
  ): Promise<PostCommentReportEntity[]> {
    if (options) {
      return this.prismaService.postCommentReport.findMany(options);
    }

    return this.prismaService.postCommentReport.findMany();
  }

  public async findOne(
    options: Prisma.PostCommentReportFindUniqueOrThrowArgs,
  ): Promise<PostCommentReportEntity> {
    return this.prismaService.postCommentReport.findUniqueOrThrow(options);
  }

  public async create(data: CreatePostCommentReportDto): Promise<PostCommentReportEntity> {
    return this.prismaService.postCommentReport.create({
      data: { ...data, reporterId: data.reporterId || '' },
    });
  }

  public async update(
    id: string,
    data: UpdatePostCommentReportDto,
  ): Promise<PostCommentReportEntity> {
    return this.prismaService.postCommentReport.update({ data, where: { id } });
  }

  public async remove(id: string): Promise<PostCommentReportEntity> {
    return this.prismaService.postCommentReport.delete({ where: { id } });
  }
}
