import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Difficulty } from 'src/common/enum';

export class updateNFTDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxGroupSize?: number;

  @IsOptional()
  @IsString()
  difficulty?: Difficulty;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingsAverage?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingsQuantity?: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceDiscount?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageCover?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
