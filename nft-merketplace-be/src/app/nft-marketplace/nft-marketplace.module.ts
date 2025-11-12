import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NftMarketplaceController } from './nft-marketplace.controller';
import { NftMarketplaceService } from './nft-marketplace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/core/middlewares/logging.middlewares';

import {
  Nft721Entity,
  Nft721MetadataEntity,
  NftHistoryEntity,
  UserEntity,
} from 'src/core/lib/database/entities';
import { BlockchainListenerService } from './nft-marketplace-listener.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft721Entity, Nft721MetadataEntity, UserEntity, NftHistoryEntity]),
  ],
  controllers: [NftMarketplaceController],
  providers: [NftMarketplaceService, BlockchainListenerService],
})
export class NftMarketplaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(LoggerMiddleware.prototype.getAll)
      .forRoutes('nft-marketplace/nfts');
  }
}
