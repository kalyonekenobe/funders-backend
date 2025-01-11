import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserRoleEntity } from 'src/modules/user/submodules/user-role/entities/user-role.entity';
import { CreateUserRoleDto } from 'src/modules/user/submodules/user-role/DTO/create-user-role.dto';
import { UpdateUserRoleDto } from 'src/modules/user/submodules/user-role/DTO/update-user-role.dto';

@Injectable()
export class UserRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: Prisma.UserRoleFindManyArgs): Promise<UserRoleEntity[]> {
    if (options) {
      return this.prismaService.userRole.findMany(options);
    }

    return this.prismaService.userRole.findMany();
  }

  public async findOne(options: Prisma.UserRoleFindUniqueOrThrowArgs): Promise<UserRoleEntity> {
    return this.prismaService.userRole.findUniqueOrThrow(options);
  }

  public async create(data: CreateUserRoleDto): Promise<UserRoleEntity> {
    return this.prismaService.userRole.create({ data });
  }

  public async update(name: string, data: UpdateUserRoleDto): Promise<UserRoleEntity> {
    return this.prismaService.userRole.update({ data, where: { name } });
  }

  public async remove(name: string): Promise<UserRoleEntity> {
    return this.prismaService.userRole.delete({ where: { name } });
  }
}
