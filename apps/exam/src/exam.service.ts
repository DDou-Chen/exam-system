import { Inject, Injectable } from '@nestjs/common';
import { AddExamDto } from './dto/add-exam.dto';
import { PrismaService } from '@app/prisma';
import { SaveExamDto } from './dto/save-exam.dto';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  getHello(): string {
    return 'Hello World!';
  }

  async add(dto: AddExamDto, id: number) {
    return this.prisma.exam.create({
      data: {
        name: dto.name,
        content: '',
        createUser: {
          connect: { id },
        },
      },
    });
  }

  // 查询当前用户的所有考试
  async list(id: number) {
    return await this.prisma.exam.findMany({
      where: { createUserId: id },
    });
  }

  delete(userId: number, id: number) {
    return this.prisma.exam.update({
      where: {
        createUserId: userId,
        id: id,
      },
      data: {
        isDelete: true,
      },
    });
  }

  async save(dto: SaveExamDto) {
    return await this.prisma.exam.update({
      where: { id: dto.id },
      data: {
        content: dto.content,
      },
    });
  }

  // 发布
  async publish(id: number, userId: number) {
    return await this.prisma.exam.update({
      where: {
        createUserId: userId,
        id,
      },
      data: { isPublish: true },
    });
  }
}
