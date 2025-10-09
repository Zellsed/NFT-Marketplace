import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PagingDto } from 'src/core/dto/base.dto';

export class getNFTDto extends PagingDto {
  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingsAverage?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingsQuantity?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceDiscount?: number;
}

export class getListNFTDto extends PagingDto {
  @IsOptional()
  @IsString()
  name?: string;
}
