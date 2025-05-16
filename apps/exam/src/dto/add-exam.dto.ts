import { IsNotEmpty } from 'class-validator';

export class AddExamDto {
  @IsNotEmpty({ message: '考试名不能为空' })
  name: string;
}
