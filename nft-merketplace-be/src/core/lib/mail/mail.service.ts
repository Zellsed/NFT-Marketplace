import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTest(email: string, token: string, resetURL: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `You Password reset token`,
      template: 'forget-password',
      context: {
        email,
        resetURL,
        token,
        year: new Date().getFullYear(),
      },
    });
  }
}
