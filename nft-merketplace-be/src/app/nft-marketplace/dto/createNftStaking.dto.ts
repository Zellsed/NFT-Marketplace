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

export class createNFTStakingDTo {
  @IsOptional()
  @IsString()
  staker: string;

  @IsOptional()
  @IsNumber()
  stakeId: number;

  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  duration: number;
}
