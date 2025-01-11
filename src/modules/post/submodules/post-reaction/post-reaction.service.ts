import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { PostReactionEntity } from './entities/post-reaction.entity';
import { CreatePostReactionDto } from './DTO/create-post-reaction.dto';
import { UpdatePostReactionDto } from './DTO/update-post-reaction.dto';

@Injectable()
export class PostReactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllForPost(postId: string): Promise<PostReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return tx.postReaction.findMany({ where: { postId } });
    });
  }

  async findAllForUser(userId: string): Promise<PostReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return tx.postReaction.findMany({ where: { userId } });
    });
  }

  async create(postId: string, data: CreatePostReactionDto): Promise<PostReactionEntity> {
    return this.prismaService.postReaction.create({ data: { ...data, postId } });
  }

  async update(
    postId: string,
    userId: string,
    data: UpdatePostReactionDto,
  ): Promise<PostReactionEntity> {
    return this.prismaService.postReaction.update({
      where: { userId_postId: { postId, userId } },
      data,
    });
  }

  async remove(postId: string, userId: string): Promise<PostReactionEntity> {
    return this.prismaService.postReaction.delete({ where: { userId_postId: { userId, postId } } });
  }
}
