import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreatePostReportDto } from 'src/modules/post/submodules/post-report/DTO/create-post-report.dto';
import { UpdatePostReportDto } from 'src/modules/post/submodules/post-report/DTO/update-post-report.dto';
import { PostReportEntity } from 'src/modules/post/submodules/post-report/entities/post-report.entity';

@Injectable()
export class PostReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: Prisma.PostReportFindManyArgs): Promise<PostReportEntity[]> {
    if (options) {
      return this.prismaService.postReport.findMany(options);
    }

    return this.prismaService.postReport.findMany();
  }

  public async findOne(options: Prisma.PostReportFindUniqueOrThrowArgs): Promise<PostReportEntity> {
    return this.prismaService.postReport.findUniqueOrThrow(options);
  }

  public async create(data: CreatePostReportDto): Promise<PostReportEntity> {
    return this.prismaService.postReport.create({
      data: { ...data, reporterId: data.reporterId || '' },
    });
  }

  public async update(id: string, data: UpdatePostReportDto): Promise<PostReportEntity> {
    return this.prismaService.postReport.update({ data, where: { id } });
  }

  public async remove(id: string): Promise<PostReportEntity> {
    return this.prismaService.postReport.delete({ where: { id } });
  }
}
