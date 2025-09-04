import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CryptoLegend, Difficulty } from 'src/common/enum';

export class buyNFTDto {
  @IsOptional()
  @IsString()
  nftId: string;

  @IsOptional()
  @IsString()
  owner: string;

  @IsOptional()
  @IsString()
  seller: string;
}

export class resellNFTDto {
  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsOptional()
  @IsString()
  owner: string;

  @IsOptional()
  @IsString()
  seller: string;

  @IsOptional()
  @IsString()
  price: string;
}
