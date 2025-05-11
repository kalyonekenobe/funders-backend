import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { CreatePostReactionDto } from 'src/modules/post/submodules/post-reaction/DTO/create-post-reaction.dto';
import { UpdatePostReactionDto } from 'src/modules/post/submodules/post-reaction/DTO/update-post-reaction.dto';
import { PostReactionEntity } from 'src/modules/post/submodules/post-reaction/entities/post-reaction.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@Injectable()
export class PostReactionService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllForPost(postId: PostEntity['id']): Promise<PostReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });

      return tx.postReaction.findMany({ where: { postId } });
    });
  }

  public async findAllForUser(userId: UserPublicEntity['id']): Promise<PostReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.postReaction.findMany({ where: { userId } });
    });
  }

  public async create(data: CreatePostReactionDto): Promise<PostReactionEntity> {
    return this.prismaService.postReaction.create({
      data: { ...data, postId: data.postId || '', userId: data.userId || '' },
    });
  }

  public async update(
    postId: PostEntity['id'],
    userId: UserPublicEntity['id'],
    data: UpdatePostReactionDto,
  ): Promise<PostReactionEntity> {
    return this.prismaService.postReaction.update({
      where: { userId_postId: { postId, userId } },
      data,
    });
  }

  public async remove(
    postId: PostEntity['id'],
    userId: UserPublicEntity['id'],
  ): Promise<PostReactionEntity> {
    return this.prismaService.postReaction.delete({ where: { userId_postId: { userId, postId } } });
  }
}
