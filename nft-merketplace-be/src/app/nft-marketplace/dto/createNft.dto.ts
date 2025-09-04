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

export class createNFTDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

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

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) =>
    typeof value === 'number' ? new Date(value) : value,
  )
  createdAt: Date;

  @IsOptional()
  @IsString()
  owner: string;

  @IsOptional()
  @IsString()
  seller: string;

  @IsOptional()
  @IsString()
  secretNfts: boolean;

  @IsOptional()
  @IsNumber()
  tokenId: number;
}
