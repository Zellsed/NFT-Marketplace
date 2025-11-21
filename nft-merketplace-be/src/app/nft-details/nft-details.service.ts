import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'src/common/enum';
import {
  Nft721Entity,
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

import 'dotenv/config';

@Injectable()
export class NftDetailsService {
  constructor(
    @InjectRepository(Nft721Entity)
    private readonly nftRepo: NFTRepository,

    @InjectRepository(NftHistoryEntity)
    private readonly nftHistoryRepo: NftHistoryRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,
  ) { }

  async getBidHistory(id: number) {
    const existNft = await this.nftRepo.findOne({ where: { tokenId: id } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    const existNftHistory = await this.nftHistoryRepo.find({
      where: { tokenId: existNft.tokenId },
    });

    const data = await Promise.all(
      existNftHistory.map(async (history) => {
        const existUser = await this.userRepo.findOne({
          where: { account: history.seller.toLowerCase() },
        });

        if (!existUser) {
          return null;
        }

        const existUserInformation = await this.userInformationRepo.findOne({
          where: { user: { id: existUser.id } },
        });

        if (!existUserInformation) {
          throw new Error('User Info not found');
        }

        history.createdAt = new Date(history.createdAt);

        return {
          history: {
            id: history.id,
            historyType: history.historyType,
            createdAt: new Date(history.createdAt).getTime(),
            owner: history.owner,
            seller: history.seller,
            price: history.price,
            tokenId: history.tokenId,
          },

          user: existUser,

          information: existUserInformation,

          existNft: existNft,
        };
      }),
    );

    return data.reverse();
  }

  async getProvenance(nftId: number) {
    const existNft = await this.nftRepo.findOne({ where: { tokenId: nftId } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    const existNftHistory = await this.nftHistoryRepo.findOne({
      where: { tokenId: existNft.tokenId, historyType: History.SELL },
    });

    return existNftHistory;
  }

  async getOwner(nftId: number) {
    const existNft = await this.nftRepo.findOne({ where: { tokenId: nftId } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    const userCreateNftHistory = await this.nftHistoryRepo.find({
      where: { tokenId: existNft.tokenId, historyType: History.SELL }, order: { createdAt: 'DESC' },
    });

    let userCreateNft = null;

    const data = await Promise.all(
      userCreateNftHistory.map(async (history) => {
        const existUser = await this.userRepo.findOne({
          where: { account: history.seller.toLowerCase() },
        });
      }),
    );
  }
}
