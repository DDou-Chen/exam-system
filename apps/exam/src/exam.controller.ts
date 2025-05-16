import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';
import { AddExamDto } from './dto/add-exam.dto';
import { UserInfo } from '@app/common';
import { SaveExamDto } from './dto/save-exam.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Get()
  async getHello() {
    const keys = await this.redisService.keys('*');
    return this.examService.getHello() + keys;
  }

  @MessagePattern('sum')
  sum(numArr: Array<number>) {
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Post('add')
  async add(@Body() dto: AddExamDto, @UserInfo('userId') id: number) {
    return await this.examService.add(dto, id);
  }

  @Get('list')
  async list(@UserInfo('userId') userId: number) {
    return this.examService.list(userId);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string, @UserInfo('userId') userId: number) {
    return this.examService.delete(userId, +id);
  }

  @Post('save')
  async save(@Body() dto: SaveExamDto) {
    return this.examService.save(dto);
  }

  @Get('publish/:id')
  async publish(@Param('id') id: string, @UserInfo('userId') userId: number) {
    return this.examService.publish(+id, userId);
  }
}
