import { IsNotEmpty, IsString } from 'class-validator';

export class forgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
