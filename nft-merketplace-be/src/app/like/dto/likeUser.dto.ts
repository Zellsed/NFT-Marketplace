import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

export class likeUserDto {
  @IsOptional()
  @IsString()
  nftId: string;

  @IsOptional()
  @IsBoolean()
  nft721?: boolean;

  @IsOptional()
  @IsBoolean()
  nft1155?: boolean;
}
