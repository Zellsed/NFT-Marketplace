import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NftMarketplaceController } from './nft-marketplace.controller';
import { NftMarketplaceService } from './nft-marketplace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/core/middlewares/logging.middlewares';

import {
  NftEntity,
  NftHistoryEntity,
  UserEntity,
} from 'src/core/lib/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([NftEntity, UserEntity, NftHistoryEntity]),
  ],
  controllers: [NftMarketplaceController],
  providers: [NftMarketplaceService],
})
export class NftMarketplaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(LoggerMiddleware.prototype.getAll)
      .forRoutes('nft-marketplace/nfts');
  }
}
