import { Module } from '@nestjs/common';
import { PostController } from 'src/modules/post/post.controller';
import { PostService } from 'src/modules/post/post.service';
import { CategoryToPostModule } from 'src/modules/post/submodules/category-to-post/category-to-post.module';
import { PostAttachmentModule } from 'src/modules/post/submodules/post-attachment/post-attachment.module';
import { PostCategoryModule } from 'src/modules/post/submodules/post-category/post-category.module';
import { PostCommentModule } from 'src/modules/post/submodules/post-comment/post-comment.module';
import { PostDonationModule } from 'src/modules/post/submodules/post-donation/post-donation.module';
import { PostReactionModule } from 'src/modules/post/submodules/post-reaction/post-reaction.module';

@Module({
  imports: [
    CategoryToPostModule,
    PostCommentModule,
    PostCategoryModule,
    PostDonationModule,
    PostReactionModule,
    PostAttachmentModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
