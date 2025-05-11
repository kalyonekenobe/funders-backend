import { Module } from '@nestjs/common';
import { FollowingModule } from 'src/modules/user/submodules/following/following.module';
import { UserRoleModule } from 'src/modules/user/submodules/user-role/user-role.module';
import { UserPenaltyModule } from 'src/modules/user/submodules/user-penalty/user-penalty.module';
import { UserReportModule } from 'src/modules/user/submodules/user-report/user-report.module';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { PostService } from 'src/modules/post/post.service';
import { PostReactionService } from 'src/modules/post/submodules/post-reaction/post-reaction.service';
import { PostCommentService } from 'src/modules/post/submodules/post-comment/post-comment.service';
import { PostCommentReactionService } from 'src/modules/post/submodules/post-comment/submodules/post-comment-reaction/post-comment-reaction.service';
import { ChatToUserService } from 'src/modules/chat/submodules/chat-to-user/chat-to-user.service';

@Module({
  imports: [FollowingModule, UserRoleModule, UserPenaltyModule, UserReportModule],
  controllers: [UserController],
  providers: [
    UserService,
    PostService,
    PostReactionService,
    PostCommentService,
    PostCommentReactionService,
    ChatToUserService,
  ],
})
export class UserModule {}
