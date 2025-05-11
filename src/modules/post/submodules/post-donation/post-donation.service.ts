import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreatePostDonationDto } from 'src/modules/post/submodules/post-donation/DTO/create-post-donation.dto';
import { UpdatePostDonationDto } from 'src/modules/post/submodules/post-donation/DTO/update-post-donation.dto';
import { PostDonationEntity } from 'src/modules/post/submodules/post-donation/entities/post-donation.entity';

@Injectable()
export class PostDonationService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: PostDonationEntity['id']): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.findUniqueOrThrow({ where: { id } });
  }

  public async findAllForPost(postId: string): Promise<PostDonationEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });

      return tx.postDonation.findMany({ where: { postId } });
    });
  }

  public async create(postId: string, data: CreatePostDonationDto): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.create({ data: { ...data, postId } });
  }

  public async update(id: string, data: UpdatePostDonationDto): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.update({ where: { id }, data });
  }

  public async remove(id: string): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.delete({ where: { id } });
  }
}
