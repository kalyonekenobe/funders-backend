import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { PostCommentReactionEntity } from './entities/post-comment-reaction.entity';
import { CreatePostCommentReactionDto } from './DTO/create-post-comment-reaction.dto';
import { UpdatePostCommentReactionDto } from './DTO/update-post-comment-reaction.dto';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@Injectable()
export class PostCommentReactionService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllForComment(
    commentId: PostCommentEntity['id'],
  ): Promise<PostCommentReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postComment.findUniqueOrThrow({ where: { id: commentId } });

      return tx.postCommentReaction.findMany({ where: { commentId } });
    });
  }

  public async findAllForUser(
    userId: UserPublicEntity['id'],
  ): Promise<PostCommentReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.postCommentReaction.findMany({ where: { userId } });
    });
  }

  public async create(data: CreatePostCommentReactionDto): Promise<PostCommentReactionEntity> {
    return this.prismaService.postCommentReaction.create({
      data: { ...data, userId: data.userId || '', commentId: data.commentId || '' },
    });
  }

  public async update(
    commentId: PostCommentEntity['id'],
    userId: UserPublicEntity['id'],
    data: UpdatePostCommentReactionDto,
  ): Promise<PostCommentReactionEntity> {
    return this.prismaService.postCommentReaction.update({
      where: { commentId_userId: { commentId, userId } },
      data,
    });
  }

  public async remove(
    commentId: PostCommentEntity['id'],
    userId: UserPublicEntity['id'],
  ): Promise<PostCommentReactionEntity> {
    return this.prismaService.postCommentReaction.delete({
      where: { commentId_userId: { userId, commentId } },
    });
  }
}
