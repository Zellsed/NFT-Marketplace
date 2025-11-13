import { Module } from '@nestjs/common';
import { NftMarketplaceModule } from './app/nft-marketplace/nft-marketplace.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';

import {
  FollowEntity,
  LikeEntity,
  Nft721Entity,
  Nft721MetadataEntity,
  NftHistoryEntity,
  TranferTokenWebEntity,
  UserEntity,
  UserInformationEntity,
} from './core/lib/database/entities';
import {
  FollowRepository,
  LikeRepository,
  NFT721MetadataRepository,
  NftHistoryRepository,
  NFTRepository,
  tranferTokenWebRepository,
  UserInformationRepository,
  UserRepository,
} from './core/lib/database/repositories';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './core/lib/mail/mail.module';
import { LikeModule } from './app/like/like.module';
import { FollowModule } from './app/follow/follow.module';
import { UserProfileModule } from './app/user-profile/user-profile.module';
import { NftDetailsModule } from './app/nft-details/nft-details.module';
import { TranferTokenWebModule } from './app/tranfer-token-web/tranfer-token-web.module';

const entities = [
  Nft721Entity,
  Nft721MetadataEntity,
  UserEntity,
  UserInformationEntity,
  NftHistoryEntity,
  LikeEntity,
  FollowEntity,
  TranferTokenWebEntity
];

const repositories = [
  NFTRepository,
  NFT721MetadataRepository,
  UserRepository,
  UserInformationRepository,
  NftHistoryRepository,
  LikeRepository,
  FollowRepository,
  tranferTokenWebRepository
];

@Module({
  imports: [
    NftMarketplaceModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          Nft721Entity,
          Nft721MetadataEntity,
          UserEntity,
          UserInformationEntity,
          NftHistoryEntity,
          LikeEntity,
          FollowEntity,
          TranferTokenWebEntity
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([...entities]),
    UserModule,
    AuthModule,
    MailModule,
    LikeModule,
    FollowModule,
    UserProfileModule,
    NftDetailsModule,
    TranferTokenWebModule,
  ],
  controllers: [],
  providers: [...repositories],
})
export class AppModule { }
