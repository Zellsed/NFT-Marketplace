import { IsNotEmpty, IsString } from 'class-validator';

export class loginAuthDto {
  @IsNotEmpty()
  @IsString()
  currentAccount: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
