import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class accountDto {
  @IsOptional()
  @IsString()
  account?: string;
}
