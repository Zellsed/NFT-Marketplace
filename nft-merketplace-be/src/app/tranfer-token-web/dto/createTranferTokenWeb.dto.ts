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

export class createTranferTokenWebDTo {
  @IsOptional()
  @IsString()
  userAddress: string;

  @IsOptional()
  @IsString()
  baseCoin: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  baseCoinAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  webTokenAmount: number;

  @IsOptional()
  @IsString()
  transactionHash: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  logIndex: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  blockNumber: number;

  @IsOptional()
  @IsString()
  blockHash: string;

}