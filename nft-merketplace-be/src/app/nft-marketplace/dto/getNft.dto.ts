import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;
}

export class getListNFTDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
