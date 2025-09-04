import { IsString } from 'class-validator';

export class MailDto {
  @IsString()
  mail: string;
}
