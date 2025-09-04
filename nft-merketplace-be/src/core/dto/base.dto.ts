import { IsNumberString, IsOptional } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
