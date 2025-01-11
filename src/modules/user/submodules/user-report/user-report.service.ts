import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreateUserReportDto } from 'src/modules/user/submodules/user-report/DTO/create-user-report.dto';
import { UpdateUserReportDto } from 'src/modules/user/submodules/user-report/DTO/update-user-report.dto';
import { UserReportEntity } from 'src/modules/user/submodules/user-report/entities/user-report.entity';

@Injectable()
export class UserReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: Prisma.UserReportFindManyArgs): Promise<UserReportEntity[]> {
    if (options) {
      return this.prismaService.userReport.findMany(options);
    }

    return this.prismaService.userReport.findMany();
  }

  public async findOne(options: Prisma.UserReportFindUniqueOrThrowArgs): Promise<UserReportEntity> {
    return this.prismaService.userReport.findUniqueOrThrow(options);
  }

  public async create(data: CreateUserReportDto): Promise<UserReportEntity> {
    return this.prismaService.userReport.create({
      data: { ...data, reporterId: data.reporterId || '' },
    });
  }

  public async update(id: string, data: UpdateUserReportDto): Promise<UserReportEntity> {
    return this.prismaService.userReport.update({ data, where: { id } });
  }

  public async remove(id: string): Promise<UserReportEntity> {
    return this.prismaService.userReport.delete({ where: { id } });
  }
}
