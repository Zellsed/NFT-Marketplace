import { Module } from '@nestjs/common';
import { NftDetailsController } from './nft-details.controller';
import { NftDetailsService } from './nft-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Nft1155Entity,
  Nft1155HistoryEntity,
  Nft721Entity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nft721Entity,
      Nft1155Entity,
      NftHistoryEntity,
      Nft1155HistoryEntity,
      UserEntity,
      UserInformationEntity,
    ]),
  ],
  controllers: [NftDetailsController],
  providers: [NftDetailsService],
})
export class NftDetailsModule { }
