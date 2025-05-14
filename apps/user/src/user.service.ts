import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '@app/email';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  private logger = new Logger();

  getHello(): string {
    return 'Hello World!';
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== user.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({
      where: { username: user.username },
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        },
      });
    } catch (error) {
      this.logger.error(error, UserService);
      return null;
    }
  }

  // 发送注册验证码
  async sendCaptcha(address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    try {
      await this.emailService.sendEmail({
        to: address,
        subject: '注册验证码',
        html: `<p>你的注册验证码是 ${code}</p>`,
      });
      return '发送成功';
    } catch (error) {
      console.log(error);

      throw new HttpException('发送失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 登录
  async login(loginUser: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: loginUser.username,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (loginUser.password !== user.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    delete user.password;

    const token = this.jwtService.sign(
      {
        userId: user.id,
        userName: user.username,
      },
      {
        expiresIn: '7d',
      },
    );

    return { user, token };
  }

  // 修改密码
  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== passwordDto.captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({ where: { username: passwordDto.username } });

    foundUser.password = passwordDto.password;

    try {
      await this.prisma.user.update({
        where: { username: passwordDto.username },
        data: foundUser,
      });

      return '密码修改成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '密码修改失败';
    }
  }

  async sendUpdateCaptcha(address: string) {
    if (!address) {
      throw new BadRequestException('邮箱地址不能为空');
    }
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendEmail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}</p>`,
    });
    return '发送成功';
  }
}
