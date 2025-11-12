import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FollowEntity,
  Nft721Entity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FollowEntity,
      UserEntity,
      UserInformationEntity,
      Nft721Entity,
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule { }
