import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/infrastructure/prisma/prisma.module';
import { CategoryToPostController } from 'src/modules/post/submodules/category-to-post/category-to-post.controller';
import { CategoryToPostService } from 'src/modules/post/submodules/category-to-post/category-to-post.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryToPostController],
  providers: [CategoryToPostService],
})
export class CategoryToPostModule {}
