import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'src/common/enum';
import {
  NftEntity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import {
  NftHistoryRepository,
  NFTRepository,
  UserInformationRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { LikeService } from '../like/like.service';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,

    @InjectRepository(NftEntity)
    private readonly nftRepo: NFTRepository,

    @InjectRepository(NftHistoryEntity)
    private readonly nftHistoryRepo: NftHistoryRepository,

    private readonly likeService: LikeService,
  ) {}

  async getUserProfile(account: string) {
    const existUser = await this.userRepo.findOne({
      where: { account: account.toLowerCase() },
    });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existUserInformation = await this.userInformationRepo.findOne({
      where: { user: existUser.id },
    });

    if (!existUserInformation) {
      throw new Error('User Info not found');
    }

    const listNft = await this.nftRepo.find({
      where: { seller: account.toLowerCase() },
    });

    const data = await Promise.all(
      listNft.map(async (nft) => {
        const existHistory = await this.nftHistoryRepo.find({
          relations: ['nft'],
          where: { tokenId: nft.tokenId },
          order: { id: 'DESC' },
        });

        const latestTransaction = existHistory[0];

        if (latestTransaction.historyType === History.BUY) {
          return null;
        }

        const likeCount = await this.likeService.getNftLikes(
          latestTransaction.nft.tokenId,
        );

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

    return {
      user: existUser,
      userInformation: existUserInformation,
      listNft: data.reverse(),
    };
  }
}
