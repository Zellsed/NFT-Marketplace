import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NftEntity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import { LikeService } from '../like/like.service';
import { LikeRepository } from 'src/core/lib/database/repositories';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserInformationEntity,
      NftEntity,
      NftHistoryEntity,
    ]),
    LikeModule,
  ],
  providers: [UserProfileService, LikeService],
  controllers: [UserProfileController],
})
export class UserProfileModule {}
