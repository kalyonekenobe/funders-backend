import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreatePostCategoryDto } from 'src/modules/post/submodules/post-category/DTO/create-post-category.dto';
import { UpdatePostCategoryDto } from 'src/modules/post/submodules/post-category/DTO/update-post-category.dto';
import { PostCategoryEntity } from 'src/modules/post/submodules/post-category/entities/post-category.entity';

@Injectable()
export class PostCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(): Promise<PostCategoryEntity[]> {
    return this.prismaService.postCategory.findMany();
  }

  public async create(data: CreatePostCategoryDto): Promise<PostCategoryEntity> {
    return this.prismaService.postCategory.create({ data });
  }

  public async update(name: string, data: UpdatePostCategoryDto): Promise<PostCategoryEntity> {
    return this.prismaService.postCategory.update({ where: { name }, data });
  }

  public async remove(name: string): Promise<PostCategoryEntity> {
    return this.prismaService.postCategory.delete({ where: { name } });
  }
}
