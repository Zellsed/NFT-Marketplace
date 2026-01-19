import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'src/common/enum';
import {
  Nft1155Entity,
  Nft1155HistoryEntity,
  Nft721Entity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
} from 'src/core/lib/database/entities';
import {
  Nft1155HistoryRepository,
  NFT1155Repository,
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

    @InjectRepository(Nft1155Entity)
    private readonly nft1155Repo: NFT1155Repository,

    @InjectRepository(Nft1155HistoryEntity)
    private readonly nft1155HistoryRepo: Nft1155HistoryRepository,

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
      order: { createdAt: 'DESC' },
      take: 10,
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

  async getBidHistorynft1155(id: number) {
    const existNft = await this.nftRepo.findOne({ where: { tokenId: id } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    const existNftHistory = await this.nft1155HistoryRepo.find({
      where: { tokenId: existNft.tokenId },
      order: { createdAt: 'DESC' },
      take: 10,
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

  async getProvenanceNFT1155(nftId: number) {
    const existNft1155 = await this.nft1155Repo.findOne({
      where: { tokenId: nftId },
    });

    if (!existNft1155) {
      throw new Error('Nft not found');
    }

    const existNft1155History = await this.nft1155HistoryRepo.findOne({
      where: { tokenId: existNft1155.tokenId, historyType: History.SELL },
    });

    return existNft1155History;
    ``;
  }

  async getOwner(nftId: number) {
    const existNft = await this.nftRepo.findOne({ where: { tokenId: nftId } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    return existNft;
  }

  async getOwnerNFT1155(nftId: number) {
    const existNft = await this.nft1155Repo.findOne({
      where: { tokenId: nftId },
    });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    return existNft;
  }
}
