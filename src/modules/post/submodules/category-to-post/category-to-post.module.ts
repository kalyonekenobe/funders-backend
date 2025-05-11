import { Module } from '@nestjs/common';
import { CategoryToPostController } from 'src/modules/post/submodules/category-to-post/category-to-post.controller';
import { CategoryToPostService } from 'src/modules/post/submodules/category-to-post/category-to-post.service';

@Module({
  controllers: [CategoryToPostController],
  providers: [CategoryToPostService],
  exports: [CategoryToPostService],
})
export class CategoryToPostModule {}
