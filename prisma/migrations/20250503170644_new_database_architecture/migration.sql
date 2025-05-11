/*
  Warnings:

  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChatMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `replyTo` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `ChatMessage` table. All the data in the column will be lost.
  - The primary key for the `ChatMessageAttachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file` on the `ChatMessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `ChatMessageAttachment` table. All the data in the column will be lost.
  - The primary key for the `ChatRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Following` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PostAttachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file` on the `PostAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `PostAttachment` table. All the data in the column will be lost.
  - The primary key for the `PostComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `parentCommentId` column on the `PostComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PostCommentAttachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file` on the `PostCommentAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `PostCommentAttachment` table. All the data in the column will be lost.
  - The primary key for the `PostCommentReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `datetime` on the `PostCommentReaction` table. All the data in the column will be lost.
  - You are about to drop the column `reactionType` on the `PostCommentReaction` table. All the data in the column will be lost.
  - The primary key for the `PostDonation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `datetime` on the `PostDonation` table. All the data in the column will be lost.
  - You are about to drop the column `donation` on the `PostDonation` table. All the data in the column will be lost.
  - You are about to drop the column `paymentInfo` on the `PostDonation` table. All the data in the column will be lost.
  - The primary key for the `PostReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `datetime` on the `PostReaction` table. All the data in the column will be lost.
  - You are about to drop the column `reactionType` on the `PostReaction` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wallet` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CategoriesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatsOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserReactionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRegistrationMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersBanListRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersBanListRecordStatus` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletPublicKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `content` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `ChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `chatId` on the `ChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `ChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `ChatMessage` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `location` to the `ChatMessageAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ChatMessageAttachment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `ChatMessageAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `messageId` on the `ChatMessageAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `ChatRole` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `ChatRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Following` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Following` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `Following` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `location` to the `PostAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostAttachment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `PostAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `PostCategory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `PostComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `PostComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `PostComment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `location` to the `PostCommentAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostCommentAttachment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `PostCommentAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `commentId` on the `PostCommentAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `reaction` to the `PostCommentReaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostCommentReaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `commentId` on the `PostCommentReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `PostCommentReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `amount` to the `PostDonation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostDonation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `PostDonation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostDonation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `reaction` to the `PostReaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostReaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `PostReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRegistrationMethods" AS ENUM ('Credentials', 'Google', 'Discord', 'SolanaWallet');

-- CreateEnum
CREATE TYPE "PostReactions" AS ENUM ('Like', 'Dislike', 'Laugh', 'Anger', 'Heart', 'Crying');

-- CreateEnum
CREATE TYPE "PostCommentReactions" AS ENUM ('Like', 'Dislike', 'Laugh', 'Anger', 'Heart', 'Crying');

-- CreateEnum
CREATE TYPE "ChatMessageReactions" AS ENUM ('Like', 'Dislike', 'Laugh', 'Anger', 'Heart', 'Crying');

-- CreateEnum
CREATE TYPE "ChatMessageStatuses" AS ENUM ('Sent', 'Read');

-- CreateEnum
CREATE TYPE "UserReportReasons" AS ENUM ('Spam', 'Cheating', 'Herrasment', 'Impersonation', 'InappropriateProfile', 'Other');

-- CreateEnum
CREATE TYPE "PostReportReasons" AS ENUM ('Spam', 'Cheating', 'HateSpeach', 'InappropriateContent', 'Violence', 'Copyright', 'Other');

-- CreateEnum
CREATE TYPE "PostCommentReportReasons" AS ENUM ('Spam', 'HateSpeach', 'InappropriateContent', 'Herrasment', 'Other');

-- CreateEnum
CREATE TYPE "UserReportStatuses" AS ENUM ('OnReview', 'AppliedPenalties', 'NoViolationsFound');

-- CreateEnum
CREATE TYPE "PostReportStatuses" AS ENUM ('OnReview', 'AppliedPenalties', 'NoViolationsFound');

-- CreateEnum
CREATE TYPE "PostCommentReportStatuses" AS ENUM ('OnReview', 'AppliedPenalties', 'NoViolationsFound');

-- CreateEnum
CREATE TYPE "ChatTypes" AS ENUM ('Private', 'Group', 'Supergroup', 'Channel');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('User', 'Volunteer', 'Administrator');

-- CreateEnum
CREATE TYPE "ChatRoles" AS ENUM ('User', 'Moderator', 'Administrator');

-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_category_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_replyTo_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessageAttachment" DROP CONSTRAINT "ChatMessageAttachment_messageId_fkey";

-- DropForeignKey
ALTER TABLE "ChatsOnUsers" DROP CONSTRAINT "ChatsOnUsers_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatsOnUsers" DROP CONSTRAINT "ChatsOnUsers_role_fkey";

-- DropForeignKey
ALTER TABLE "ChatsOnUsers" DROP CONSTRAINT "ChatsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostAttachment" DROP CONSTRAINT "PostAttachment_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostCommentAttachment" DROP CONSTRAINT "PostCommentAttachment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostCommentReaction" DROP CONSTRAINT "PostCommentReaction_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostCommentReaction" DROP CONSTRAINT "PostCommentReaction_reactionType_fkey";

-- DropForeignKey
ALTER TABLE "PostCommentReaction" DROP CONSTRAINT "PostCommentReaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostDonation" DROP CONSTRAINT "PostDonation_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_reactionType_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_registrationMethod_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_fkey";

-- DropForeignKey
ALTER TABLE "UsersBanListRecord" DROP CONSTRAINT "UsersBanListRecord_status_fkey";

-- DropForeignKey
ALTER TABLE "UsersBanListRecord" DROP CONSTRAINT "UsersBanListRecord_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "type" "ChatTypes" NOT NULL DEFAULT 'Private',
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_pkey",
DROP COLUMN "replyTo",
DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "parentMessageId" UUID,
ADD COLUMN     "status" "ChatMessageStatuses" NOT NULL DEFAULT 'Sent',
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "chatId",
ADD COLUMN     "chatId" UUID NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "removedAt" SET DATA TYPE TIMESTAMPTZ,
ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChatMessageAttachment" DROP CONSTRAINT "ChatMessageAttachment_pkey",
DROP COLUMN "file",
DROP COLUMN "resourceType",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "messageId",
ADD COLUMN     "messageId" UUID NOT NULL,
ADD CONSTRAINT "ChatMessageAttachment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChatRole" DROP CONSTRAINT "ChatRole_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "permissions" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "ChatRoles" NOT NULL,
ADD CONSTRAINT "ChatRole_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Following" DROP CONSTRAINT "Following_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "followerId",
ADD COLUMN     "followerId" UUID NOT NULL,
ADD CONSTRAINT "Following_pkey" PRIMARY KEY ("userId", "followerId");

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ADD COLUMN     "deadline" TIMESTAMPTZ,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" UUID NOT NULL,
ALTER COLUMN "image" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "removedAt" SET DATA TYPE TIMESTAMPTZ,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostAttachment" DROP CONSTRAINT "PostAttachment_pkey",
DROP COLUMN "file",
DROP COLUMN "resourceType",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
ADD CONSTRAINT "PostAttachment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostCategory" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" UUID NOT NULL,
DROP COLUMN "parentCommentId",
ADD COLUMN     "parentCommentId" UUID,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "removedAt" SET DATA TYPE TIMESTAMPTZ,
ADD CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostCommentAttachment" DROP CONSTRAINT "PostCommentAttachment_pkey",
DROP COLUMN "file",
DROP COLUMN "resourceType",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "commentId",
ADD COLUMN     "commentId" UUID NOT NULL,
ADD CONSTRAINT "PostCommentAttachment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostCommentReaction" DROP CONSTRAINT "PostCommentReaction_pkey",
DROP COLUMN "datetime",
DROP COLUMN "reactionType",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reaction" "PostCommentReactions" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "commentId",
ADD COLUMN     "commentId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "PostCommentReaction_pkey" PRIMARY KEY ("commentId", "userId");

-- AlterTable
ALTER TABLE "PostDonation" DROP CONSTRAINT "PostDonation_pkey",
DROP COLUMN "datetime",
DROP COLUMN "donation",
DROP COLUMN "paymentInfo",
ADD COLUMN     "amount" MONEY NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "details" JSON NOT NULL DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
ADD CONSTRAINT "PostDonation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_pkey",
DROP COLUMN "datetime",
DROP COLUMN "reactionType",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reaction" "PostReactions" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
ADD CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("userId", "postId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "avatar",
DROP COLUMN "registeredAt",
DROP COLUMN "registrationMethod",
DROP COLUMN "wallet",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "userRegistrationMethod" "UserRegistrationMethods" NOT NULL DEFAULT 'Credentials',
ADD COLUMN     "walletPublicKey" VARCHAR(255),
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'User',
ALTER COLUMN "birthDate" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "stripeCustomerId" DROP DEFAULT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "UserRoles" NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("name");

-- DropTable
DROP TABLE "CategoriesOnPosts";

-- DropTable
DROP TABLE "ChatsOnUsers";

-- DropTable
DROP TABLE "UserReactionType";

-- DropTable
DROP TABLE "UserRegistrationMethod";

-- DropTable
DROP TABLE "UsersBanListRecord";

-- DropTable
DROP TABLE "UsersBanListRecordStatus";

-- CreateTable
CREATE TABLE "UserPenalty" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dueTo" TIMESTAMPTZ,
    "note" TEXT NOT NULL,
    "permissionsPenalty" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserPenalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReport" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "reason" "UserReportReasons" NOT NULL,
    "status" "UserReportStatuses" NOT NULL DEFAULT 'OnReview',
    "note" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessageReaction" (
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "reaction" "ChatMessageReactions" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ChatMessageReaction_pkey" PRIMARY KEY ("messageId","userId")
);

-- CreateTable
CREATE TABLE "ChatToUser" (
    "chatId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "ChatRoles" NOT NULL DEFAULT 'User',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenMessageTimestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ChatToUser_pkey" PRIMARY KEY ("chatId","userId")
);

-- CreateTable
CREATE TABLE "PostReport" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "reason" "PostReportReasons" NOT NULL,
    "status" "PostReportStatuses" NOT NULL DEFAULT 'OnReview',
    "note" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "PostReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCommentReport" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "postCommentId" UUID NOT NULL,
    "reason" "PostCommentReportReasons" NOT NULL,
    "status" "PostCommentReportStatuses" NOT NULL DEFAULT 'OnReview',
    "note" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "PostCommentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryToPost" (
    "postId" UUID NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CategoryToPost_pkey" PRIMARY KEY ("postId","category")
);

-- CreateIndex
CREATE INDEX "UserPenalty_userId_dueTo_createdAt_updatedAt_idx" ON "UserPenalty"("userId", "dueTo", "createdAt", "updatedAt");

-- CreateIndex
CREATE INDEX "UserReport_reporterId_userId_reason_idx" ON "UserReport"("reporterId", "userId", "reason");

-- CreateIndex
CREATE INDEX "ChatMessageReaction_messageId_userId_reaction_idx" ON "ChatMessageReaction"("messageId", "userId", "reaction");

-- CreateIndex
CREATE INDEX "ChatToUser_chatId_userId_lastSeenMessageTimestamp_idx" ON "ChatToUser"("chatId", "userId", "lastSeenMessageTimestamp");

-- CreateIndex
CREATE INDEX "PostReport_reporterId_postId_reason_idx" ON "PostReport"("reporterId", "postId", "reason");

-- CreateIndex
CREATE INDEX "PostCommentReport_reporterId_postCommentId_reason_idx" ON "PostCommentReport"("reporterId", "postCommentId", "reason");

-- CreateIndex
CREATE INDEX "CategoryToPost_postId_category_idx" ON "CategoryToPost"("postId", "category");

-- CreateIndex
CREATE INDEX "Chat_name_idx" ON "Chat"("name");

-- CreateIndex
CREATE INDEX "ChatMessage_chatId_authorId_isPinned_createdAt_idx" ON "ChatMessage"("chatId", "authorId", "isPinned", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessageAttachment_messageId_idx" ON "ChatMessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "ChatRole_name_permissions_idx" ON "ChatRole"("name", "permissions");

-- CreateIndex
CREATE INDEX "Following_userId_followerId_idx" ON "Following"("userId", "followerId");

-- CreateIndex
CREATE INDEX "Post_authorId_title_isDraft_idx" ON "Post"("authorId", "title", "isDraft");

-- CreateIndex
CREATE INDEX "PostAttachment_postId_idx" ON "PostAttachment"("postId");

-- CreateIndex
CREATE INDEX "PostCategory_name_idx" ON "PostCategory"("name");

-- CreateIndex
CREATE INDEX "PostComment_postId_authorId_parentCommentId_idx" ON "PostComment"("postId", "authorId", "parentCommentId");

-- CreateIndex
CREATE INDEX "PostCommentAttachment_commentId_idx" ON "PostCommentAttachment"("commentId");

-- CreateIndex
CREATE INDEX "PostCommentReaction_commentId_userId_reaction_idx" ON "PostCommentReaction"("commentId", "userId", "reaction");

-- CreateIndex
CREATE INDEX "PostDonation_postId_amount_idx" ON "PostDonation"("postId", "amount");

-- CreateIndex
CREATE INDEX "PostReaction_userId_postId_reaction_idx" ON "PostReaction"("userId", "postId", "reaction");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletPublicKey_key" ON "User"("walletPublicKey");

-- CreateIndex
CREATE INDEX "User_email_walletPublicKey_role_stripeCustomerId_userRegist_idx" ON "User"("email", "walletPublicKey", "role", "stripeCustomerId", "userRegistrationMethod");

-- CreateIndex
CREATE INDEX "UserRole_name_permissions_idx" ON "UserRole"("name", "permissions");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "UserRole"("name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPenalty" ADD CONSTRAINT "UserPenalty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageAttachment" ADD CONSTRAINT "ChatMessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageReaction" ADD CONSTRAINT "ChatMessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageReaction" ADD CONSTRAINT "ChatMessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatToUser" ADD CONSTRAINT "ChatToUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatToUser" ADD CONSTRAINT "ChatToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatToUser" ADD CONSTRAINT "ChatToUser_role_fkey" FOREIGN KEY ("role") REFERENCES "ChatRole"("name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReport" ADD CONSTRAINT "PostReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReport" ADD CONSTRAINT "PostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAttachment" ADD CONSTRAINT "PostAttachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDonation" ADD CONSTRAINT "PostDonation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentReport" ADD CONSTRAINT "PostCommentReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentReport" ADD CONSTRAINT "PostCommentReport_postCommentId_fkey" FOREIGN KEY ("postCommentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentReaction" ADD CONSTRAINT "PostCommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentReaction" ADD CONSTRAINT "PostCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentAttachment" ADD CONSTRAINT "PostCommentAttachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToPost" ADD CONSTRAINT "CategoryToPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToPost" ADD CONSTRAINT "CategoryToPost_category_fkey" FOREIGN KEY ("category") REFERENCES "PostCategory"("name") ON DELETE NO ACTION ON UPDATE CASCADE;
