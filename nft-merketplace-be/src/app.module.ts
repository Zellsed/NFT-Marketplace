import { Module } from '@nestjs/common';
import { NftMarketplaceModule } from './app/nft-marketplace/nft-marketplace.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';

import {
  FollowEntity,
  LikeEntity,
  NftEntity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
} from './core/lib/database/entities';
import {
  FollowRepository,
  LikeRepository,
  NftHistoryRepository,
  NFTRepository,
  UserInformationRepository,
  UserRepository,
} from './core/lib/database/repositories';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './core/lib/mail/mail.module';
import { LikeModule } from './app/like/like.module';
import { FollowModule } from './app/follow/follow.module';
import { UserProfileModule } from './app/user-profile/user-profile.module';
import { NftDetailsModule } from './app/nft-details/nft-details.module';

const entities = [
  NftEntity,
  UserEntity,
  UserInformationEntity,
  NftHistoryEntity,
  LikeEntity,
  FollowEntity,
];

const repositories = [
  NFTRepository,
  UserRepository,
  UserInformationRepository,
  NftHistoryRepository,
  LikeRepository,
  FollowRepository,
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
          NftEntity,
          UserEntity,
          UserInformationEntity,
          NftHistoryEntity,
          LikeEntity,
          FollowEntity,
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
  ],
  controllers: [],
  providers: [...repositories],
})
export class AppModule {}
