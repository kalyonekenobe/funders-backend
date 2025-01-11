import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { CreateFollowingDto } from 'src/modules/user/submodules/following/DTO/create-following.dto';
import { FollowingEntity } from 'src/modules/user/submodules/following/entities/following.entity';

@Injectable()
export class FollowingService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllUserFollowers(
    userId: string,
    options?: Prisma.FollowingFindManyArgs,
  ): Promise<UserPublicEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.following
        .findMany(
          _.merge(options, {
            where: { userId },
            select: { follower: { omit: { password: true, refreshToken: true } } },
          }),
        )
        .then(result => result.map(entry => entry.follower));
    });
  }

  public async findAllUserFollowings(
    followerId: string,
    options?: Prisma.FollowingFindManyArgs,
  ): Promise<UserPublicEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: followerId } });

      return tx.following
        .findMany(
          _.merge(options, {
            where: { followerId },
            select: {
              user: { omit: { password: true, refreshToken: true } },
            },
          }),
        )
        .then(result => result.map(entry => entry.user));
    });
  }

  public async create(data: CreateFollowingDto): Promise<FollowingEntity> {
    return this.prismaService.following.create({
      data,
      include: {
        user: { omit: { password: true, refreshToken: true } },
        follower: { omit: { password: true, refreshToken: true } },
      },
    });
  }

  public async remove(userId: string, followerId: string): Promise<FollowingEntity> {
    return this.prismaService.following.delete({
      where: { userId_followerId: { userId, followerId } },
      include: {
        user: { omit: { password: true, refreshToken: true } },
        follower: { omit: { password: true, refreshToken: true } },
      },
    });
  }
}
