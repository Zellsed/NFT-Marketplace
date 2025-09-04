import { IsNotEmpty, IsString } from 'class-validator';

export class updatePasswordDto {
  @IsNotEmpty()
  @IsString()
  passwordCurrent: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;
}
