import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FollowEntity,
  NftEntity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import {
  FollowRepository,
  NFTRepository,
  UserInformationRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { Repository } from 'typeorm';
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepo: FollowRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,

    @InjectRepository(NftEntity)
    private readonly nftRepo: NFTRepository,
  ) {}

  async followUser(userId: number, accountFollowing: FollowDto) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existFollowing = await this.userRepo.findOne({
      where: { account: accountFollowing.accountFollowing.toLowerCase() },
    });

    if (!existFollowing) {
      throw new Error('Following not found');
    }

    const existFollow = await this.followRepo.findOne({
      where: { follower: existUser.id, following: existFollowing.id },
    });

    if (existFollow) {
      await this.followRepo.delete(existFollow.id);

      return {
        message: 'Unfollow successfully',
        liked: false,
      };
    } else {
      const newFollow = await this.followRepo.create({
        follower: existUser,
        following: existFollowing,
      });

      await this.followRepo.save(newFollow);

      return {
        message: 'Follow successfully',
        liked: true,
      };
    }
  }

  async followStatus(userId: number, account: string) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existFollowing = await this.userRepo.findOne({
      where: { account: account.toLowerCase() },
    });

    if (!existFollowing) {
      throw new Error('Following not found');
    }

    const existFollow = await this.followRepo.findOne({
      where: { follower: existUser.id, following: existFollowing.id },
    });

    return {
      user: existUser,
      following: existFollowing,
      exists: !!existFollow,
    };
  }

  async getListFollow(userId: number) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const listFollow = await this.followRepo.find({
      where: { follower: existUser.id },
      relations: ['following'],
    });

    const data = await Promise.all(
      listFollow.map(async (user) => {
        const userInformation = await this.userInformationRepo.findOne({
          where: { user: user.following.id },
        });

        if (!userInformation) {
          throw new Error('User Info not found');
        }

        const nftList = await this.nftRepo.find({
          where: { user: user.following.id },
        });

        const price = nftList.reduce((sum, nft) => sum + nft.price, 0);

        return {
          seller: user.following.account,
          total: price,
        };
      }),
    );

    return data.reverse();
  }

  async getListFollower(userId: number) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const listFollower = await this.followRepo.find({
      where: { following: existUser.id },
      relations: ['follower'],
    });

    const data = await Promise.all(
      listFollower.map(async (user) => {
        const userInformation = await this.userInformationRepo.findOne({
          where: { user: user.follower.id },
        });

        if (!userInformation) {
          throw new Error('User Info not found');
        }

        const nftList = await this.nftRepo.find({
          where: { user: user.follower.id },
        });

        const price = nftList.reduce((sum, nft) => sum + nft.price, 0);

        return {
          seller: user.follower.account,
          total: price,
        };
      }),
    );

    return data.reverse();
  }
}
