import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

// # nodemailer 相关配置
// nodemailer_host=smtp.qq.com
// nodemailer_port=587
// nodemailer_auth_user=913321406@qq.com   # 发邮件的邮箱地址
// nodemailer_auth_pass=nzdyfpcnpunsbdhh  # 邮箱授权码

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '913321406@qq.com',
        pass: 'nzdyfpcnpunsbdhh',
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '考试系统',
        address: '913321406@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
