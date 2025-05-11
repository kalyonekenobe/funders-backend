import { ApiProperty } from '@nestjs/swagger';
import { User, UserRegistrationMethods, UserRoles } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ChatMessageEntity } from 'src/modules/chat/submodules/chat-message/entities/chat-message.entity';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { PostCommentEntity } from 'src/modules/post/submodules/post-comment/entities/post-comment.entity';
import { PostCommentReactionEntity } from 'src/modules/post/submodules/post-comment/submodules/post-comment-reaction/entities/post-comment-reaction.entity';
import { PostDonationEntity } from 'src/modules/post/submodules/post-donation/entities/post-donation.entity';
import { PostReactionEntity } from 'src/modules/post/submodules/post-reaction/entities/post-reaction.entity';
import { FollowingEntity } from 'src/modules/user/submodules/following/entities/following.entity';
import { UserRoleEntity } from 'src/modules/user/submodules/user-role/entities/user-role.entity';
import { UserPenaltyEntity } from 'src/modules/user/submodules/user-penalty/entities/user-penalty.entity';
import { UserReportEntity } from 'src/modules/user/submodules/user-report/entities/user-report.entity';
import { ChatToUserEntity } from 'src/modules/chat/submodules/chat-to-user/entities/chat-to-user.entity';

export class UserEntity implements User {
  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: "User's registration method",
    examples: Object.values(UserRegistrationMethods),
    default: Object.values(UserRegistrationMethods)[0],
  })
  @IsEnum(UserRegistrationMethods)
  @IsNotEmpty()
  @IsDefined()
  userRegistrationMethod: UserRegistrationMethods;

  @ApiProperty({
    description: "User's role",
    examples: ['Default', 'Volunteer', 'Administrator'],
    default: 'Administrator',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  role: UserRoles;

  @ApiProperty({
    description: "User's first name",
    examples: ['Alex', 'Helen', 'John'],
    default: 'Alex',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    examples: ['Igumnov', 'Smith', 'Doe'],
    default: 'Igumnov',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  lastName: string;

  @ApiProperty({
    description: "User's birth date",
    examples: [new Date('2004-09-03'), new Date('1998-11-30'), new Date('1987-04-12')],
    default: new Date('2004-09-03'),
  })
  @Transform(date => new Date(date.value))
  @IsDate()
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 14)))
  @IsNotEmpty()
  @IsDefined()
  birthDate: Date;

  @ApiProperty({
    description: "User's email",
    examples: ['alexigumnov@gmail.com', 'helensmith@gmail.com', 'johndoe@gmail.com'],
    default: 'alexigumnov@gmail.com',
  })
  @MaxLength(50)
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: "User's password",
    examples: [
      '8c2e53731925c9addc09145a7f1ea196f753cb115e8c9dfbb8fdcbe855a3beec',
      '32c9a2ec9e0c4e3a4cc93012b2e72c04b2c395578dcc80b535e951b452eaf9a3',
    ],
    default: '8c2e53731925c9addc09145a7f1ea196f753cb115e8c9dfbb8fdcbe855a3beec',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  password: string | null;

  @ApiProperty({
    description: "User's phone number",
    examples: ['+380987654321', '+145960105415', '+849501050319'],
    default: '+380987654321',
  })
  @MaxLength(15)
  @IsPhoneNumber()
  @ValidateIf((_, value) => value)
  phone: string | null;

  @ApiProperty({
    description: "User's bio",
    examples: [
      'Student of Kyiv-Mohyla Academy',
      'The mother of 3',
      'Full-Stack JavaScript Developer',
    ],
    default: 'Student of Kyiv-Mohyla Academy',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  bio: string | null;

  @ApiProperty({ description: 'The image of the user' })
  @IsString()
  @ValidateIf((_, value) => value)
  image: string | null;

  @ApiProperty({
    description: "User's refresh roken",
    examples: [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSWd1bW5vdiIsImlhdCI6MTUxNjIzOTAyMn0.fhRab81aDGeIyrQPsQDk5-EoFmX93_ImE4szjSFZE08',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhlbGVuIFNtaXRoIiwiaWF0IjoxNTE2MjM5MDIyfQ.gpUgoLzilOQcnkgQZIZRd1TGlcT6_A0RMz30OwB8z4A',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    ],
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSWd1bW5vdiIsImlhdCI6MTUxNjIzOTAyMn0.fhRab81aDGeIyrQPsQDk5-EoFmX93_ImE4szjSFZE08',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  refreshToken: string | null;

  @ApiProperty({
    description: 'Stripe customer id of this user',
    examples: ['cus_NffrFeUfNV2Hib', 'cus_FJANdAJafEQdIq'],
    default: 'cus_NffrFeUfNV2Hib',
  })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  stripeCustomerId: string;

  @ApiProperty({
    description: "User's crypto wallet",
    examples: [
      'G5ZegMhe8wwnw257tzAdWfDdYWfE2SbVwK4VEpWTYN9A',
      'EDFVK31PPpHM7nnv6NUSMTGko46v1u5j8TXnXje1CMPw',
    ],
    default: 'G5ZegMhe8wwnw257tzAdWfDdYWfE2SbVwK4VEpWTYN9A',
  })
  @IsString()
  @ValidateIf((_, value) => value)
  walletPublicKey: string | null;

  @ApiProperty({
    description: 'User creation date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'User last updated date and time',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date;

  @ApiProperty({ description: "User's role nested object" })
  userRole?: UserRoleEntity;

  @ApiProperty({ description: 'The nested array of followings of this user' })
  followings?: FollowingEntity[];

  @ApiProperty({ description: 'The nested array of followers of this user' })
  followers?: FollowingEntity[];

  @ApiProperty({ description: 'The nested array of user penalties of this user' })
  userPenalties?: UserPenaltyEntity[];

  @ApiProperty({ description: 'The nested array of incoming user reports of this user' })
  userReports?: UserReportEntity[];

  @ApiProperty({ description: 'The nested array of outcoming user reports of this user' })
  outcomingUserReports?: UserReportEntity[];

  @ApiProperty({ description: 'The nested array of chat to user of this user' })
  chatsToUsers?: ChatToUserEntity[];

  @ApiProperty({ description: 'The nested array of messages of this user' })
  messages?: ChatMessageEntity[];

  @ApiProperty({ description: 'The nested array of posts of this user' })
  posts?: PostEntity[];

  @ApiProperty({ description: 'The nested array of post reactions of this user' })
  postReactions?: PostReactionEntity[];

  @ApiProperty({ description: 'The nested array of donations of this user' })
  donations?: PostDonationEntity[];

  @ApiProperty({ description: 'The nested array of comments of this user' })
  comments?: PostCommentEntity[];

  @ApiProperty({ description: 'The nested array of comment reactions of this user' })
  commentReactions?: PostCommentReactionEntity[];
}
