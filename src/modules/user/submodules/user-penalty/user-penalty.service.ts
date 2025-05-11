import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import { UserPenaltyEntity } from 'src/modules/user/submodules/user-penalty/entities/user-penalty.entity';
import { CreateUserPenaltyDto } from 'src/modules/user/submodules/user-penalty/DTO/create-user-penalty.dto';
import { UpdateUserPenaltyDto } from 'src/modules/user/submodules/user-penalty/DTO/update-user-penalty.dto';

@Injectable()
export class UserPenaltyService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: Prisma.UserPenaltyFindManyArgs): Promise<UserPenaltyEntity[]> {
    if (options) {
      return this.prismaService.userPenalty.findMany(options);
    }

    return this.prismaService.userPenalty.findMany();
  }

  public async findAllUserBans(
    userId: string,
    options?: Prisma.UserPenaltyFindManyArgs,
  ): Promise<UserPenaltyEntity[]> {
    return this.prismaService.userPenalty.findMany(_.merge(options, { where: { userId } }));
  }

  public async findOne(
    options: Prisma.UserPenaltyFindUniqueOrThrowArgs,
  ): Promise<UserPenaltyEntity> {
    return this.prismaService.userPenalty.findUniqueOrThrow(options);
  }

  public async create(data: CreateUserPenaltyDto): Promise<UserPenaltyEntity> {
    return this.prismaService.userPenalty.create({ data: { ...data, userId: data.userId || '' } });
  }

  public async update(id: string, data: UpdateUserPenaltyDto): Promise<UserPenaltyEntity> {
    return this.prismaService.userPenalty.update({ where: { id }, data });
  }

  public async remove(id: string): Promise<UserPenaltyEntity> {
    return this.prismaService.userPenalty.delete({ where: { id } });
  }
}
