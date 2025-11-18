import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NftMarketplaceController } from './nft-marketplace.controller';
import { NftMarketplaceService } from './nft-marketplace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/core/middlewares/logging.middlewares';

import {
  LikeEntity,
  Nft721Entity,
  Nft721MetadataEntity,
  Nft721StakingEntity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
  UserSpentEntity,
} from 'src/core/lib/database/entities';
import { NftMarketplaceListenerService } from './blockchain-listener/nft-marketplace-listener.service';
import { NFTStakingListenerService } from './blockchain-listener/nft-staking-listener.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nft721Entity,
      Nft721MetadataEntity,
      UserEntity,
      NftHistoryEntity,
      LikeEntity,
      UserInformationEntity,
      UserSpentEntity,
      Nft721StakingEntity
    ]),
  ],
  controllers: [NftMarketplaceController],
  providers: [
    NftMarketplaceService,
    NftMarketplaceListenerService,
    NFTStakingListenerService,
  ],
})
export class NftMarketplaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(LoggerMiddleware.prototype.getAll)
      .forRoutes('nft-marketplace/nfts');
  }
}
