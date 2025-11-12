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

export class createNFTDTo {
  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  seller: string;

  @IsOptional()
  @IsString()
  owner: string;

  @IsOptional()
  @IsString()
  sold: boolean;
}

export class metadataNFTDto {
  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsOptional()
  @IsString()
  tokenURI: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  pinataData: string;

  @IsOptional()
  @IsEnum(CryptoLegend)
  category: CryptoLegend;

  @IsOptional()
  @IsString()
  fileExtension: string;

  @IsOptional()
  @IsString()
  fileSize: string;
}