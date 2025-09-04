import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailDto } from './dto/mail.dto';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
}
