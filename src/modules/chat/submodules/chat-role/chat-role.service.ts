import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateChatRoleDto } from 'src/modules/chat/submodules/chat-role/DTO/create-chat-role.dto';
import { UpdateChatRoleDto } from 'src/modules/chat/submodules/chat-role/DTO/update-chat-role.dto';
import { ChatRoleEntity } from 'src/modules/chat/submodules/chat-role/entities/chat-role.entity';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';

@Injectable()
export class ChatRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: Prisma.ChatRoleFindManyArgs): Promise<ChatRoleEntity[]> {
    if (options) {
      return this.prismaService.chatRole.findMany(options);
    }

    return this.prismaService.chatRole.findMany();
  }

  public async findOne(options: Prisma.ChatRoleFindUniqueOrThrowArgs): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.findUniqueOrThrow(options);
  }

  public async create(data: CreateChatRoleDto): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.create({ data });
  }

  public async update(
    name: ChatRoleEntity['name'],
    data: UpdateChatRoleDto,
  ): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.update({ where: { name }, data });
  }

  public async remove(name: ChatRoleEntity['name']): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.delete({ where: { name } });
  }
}
