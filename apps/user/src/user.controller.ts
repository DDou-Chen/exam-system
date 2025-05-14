import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SkipLogin } from '@app/common';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
@SkipLogin()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello() {
    return this.userService.getHello();
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async sendCaptcha(@Query('address') address: string) {
    return await this.userService.sendCaptcha(address);
  }

  @Post('login')
  async login(@Body() user: LoginUserDto) {
    return await this.userService.login(user);
  }

  @Post('update_password')
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    return this.userService.sendUpdateCaptcha(address);
  }
}
