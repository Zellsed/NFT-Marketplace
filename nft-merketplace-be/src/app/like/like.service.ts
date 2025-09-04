import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'src/common/enum';
import {
  LikeEntity,
  NftEntity,
  NftHistoryEntity,
  UserEntity,
} from 'src/core/lib/database/entities';
import {
  LikeRepository,
  NftHistoryRepository,
  NFTRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepo: LikeRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(NftEntity)
    private readonly nftRepo: NFTRepository,

    @InjectRepository(NftHistoryEntity)
    private readonly nftHistoryRepo: NftHistoryRepository,
  ) {}

  async likeNft(userId: number, nftId: number) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existNft = await this.nftRepo.findOne({ where: { tokenId: nftId } });

    if (!existNft) {
      throw new Error('NFT not found');
    }

    const existingLike = await this.likeRepo.findOne({
      where: { user: userId, nft: nftId },
    });

    if (existingLike) {
      await this.likeRepo.delete(existingLike.id);

      return {
        message: 'Unliked successfully',
        liked: false,
      };
    } else {
      const newLike = await this.likeRepo.create({
        user: existUser,
        tokenId: existNft.tokenId,
        nft: existNft,
      });

      await this.likeRepo.save(newLike);

      return {
        message: 'Like successfully',
        liked: true,
      };
    }
  }

  async likeStatus(userId: number, nftId: number) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existNft = await this.nftRepo.findOne({ where: { tokenId: nftId } });

    if (!existNft) {
      throw new Error('NFT not found');
    }

    const existingLike = await this.likeRepo.findOne({
      where: { user: userId, tokenId: nftId },
    });

    return { exists: !!existingLike };
  }

  async getNftLikes(nftId: number) {
    const likeCount = await this.likeRepo.count({
      where: { tokenId: nftId },
    });

    return {
      nftId,
      likeCount,
    };
  }

  async getListNftLike(userId: number) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existLike = await this.likeRepo.find({
      where: { user: existUser.id },
      relations: ['nft'],
    });

    if (!existLike) {
      throw new Error('Like Nft not found');
    }

    const data = await Promise.all(
      existLike.map(async (nft) => {
        const existHistory = await this.nftHistoryRepo.find({
          relations: ['nft'],
          where: { tokenId: nft.tokenId },
          order: { id: 'DESC' },
        });

        const latestTransaction = existHistory[0];

        if (latestTransaction.historyType === History.BUY) {
          return null;
        }

        const likeCount = await this.getNftLikes(latestTransaction.nft.tokenId);

        return {
          category: latestTransaction.nft.category,
          createdAt: new Date(latestTransaction.nft.createdAt).getTime(),
          description: latestTransaction.nft.description,
          fileExtension: latestTransaction.nft.fileExtension,
          fileSize: latestTransaction.nft.fileSize,
          likes: likeCount.likeCount,
          name: latestTransaction.nft.name,
          owner: latestTransaction.nft.owner,
          pinataData: latestTransaction.nft.pinataData,
          price: latestTransaction.nft.price,
          seller: latestTransaction.nft.seller,
          tokenId: latestTransaction.nft.tokenId,
        };
      }),
    );

    return data.reverse();
  }
}
