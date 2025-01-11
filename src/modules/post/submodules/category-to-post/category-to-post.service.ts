import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreateCategoryToPostDto } from 'src/modules/post/submodules/category-to-post/DTO/create-category-to-post.dto';
import { PostCategoryEntity } from 'src/modules/post/submodules/post-category/entities/post-category.entity';

@Injectable()
export class CategoryToPostService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllPostCategories(postId: string): Promise<PostCategoryEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });

      return tx.categoryToPost
        .findMany({
          where: { postId },
          select: { postCategory: true },
        })
        .then(result => result.map(item => item.postCategory));
    });
  }

  public async createPostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      await tx.categoryToPost.createMany({
        data: categories.map(category => ({
          postId,
          category: category.name,
        })),
        skipDuplicates: false,
      });

      return categories;
    });
  }

  public async updatePostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      await tx.categoryToPost.deleteMany({ where: { postId } });
      await tx.categoryToPost.createMany({
        data: categories.map(
          category => ({ postId, category: category.name }) as CreateCategoryToPostDto,
        ),
        skipDuplicates: false,
      });

      return categories;
    });
  }

  public async removePostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });

      tx.categoryToPost.deleteMany({
        where: {
          AND: {
            postId,
            category: {
              in: categories.map(category => category.name),
            },
          },
        },
      });

      return categories;
    });
  }
}
