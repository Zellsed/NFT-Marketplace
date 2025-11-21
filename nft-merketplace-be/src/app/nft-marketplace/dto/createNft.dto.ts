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

export class createNFT1155DTo {
  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsOptional()
  @IsString()
  nftContract: string;

  @IsOptional()
  @IsString()
  seller: string;

  @IsOptional()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountAvailable: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  totalPrice: number;

  @IsOptional()
  @IsString()
  sold: boolean;

  @IsOptional()
  @IsString()
  txHash: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  logIndex: number;
}

export class createBuyNFT1155DTo {
  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  tokenId: number;

  @IsOptional()
  @IsString()
  seller: string;

  @IsOptional()
  @IsString()
  buyer: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountBought: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  txHash: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  logIndex: number;
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