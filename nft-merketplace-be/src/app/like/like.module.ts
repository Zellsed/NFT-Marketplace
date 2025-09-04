import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LikeEntity,
  NftEntity,
  NftHistoryEntity,
  UserEntity,
} from 'src/core/lib/database/entities';
import { UserModule } from '../user/user.module';
import { LikeRepository } from 'src/core/lib/database/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LikeEntity,
      UserEntity,
      NftEntity,
      NftHistoryEntity,
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
  exports: [LikeService, LikeRepository, TypeOrmModule],
})
export class LikeModule {}
