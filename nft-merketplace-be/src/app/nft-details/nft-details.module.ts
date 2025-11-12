import { Module } from '@nestjs/common';
import { NftDetailsController } from './nft-details.controller';
import { NftDetailsService } from './nft-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Nft721Entity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nft721Entity,
      NftHistoryEntity,
      UserEntity,
      UserInformationEntity,
    ]),
  ],
  controllers: [NftDetailsController],
  providers: [NftDetailsService],
})
export class NftDetailsModule { }
