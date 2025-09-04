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

import 'dotenv/config';

@Injectable()
export class NftDetailsService {
  constructor(
    @InjectRepository(NftEntity)
    private readonly nftRepo: NFTRepository,

    @InjectRepository(NftHistoryEntity)
    private readonly nftHistoryRepo: NftHistoryRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,
  ) {}

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
          where: { user: existUser.id },
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

    const existNftHistory = await this.nftHistoryRepo.find({
      where: { tokenId: existNft.tokenId },
    });

    const data = await Promise.all(
      existNftHistory.map(async (history) => {
        let existUser = null;

        if (
          history.owner.toLowerCase() ===
          process.env.NFTMarketplaceAddress.toLowerCase()
        ) {
          existUser = await this.userRepo.findOne({
            where: { account: history.seller.toLowerCase() },
          });
        } else {
          existUser = await this.userRepo.findOne({
            where: { account: history.owner.toLowerCase() },
          });
        }

        if (!existUser) {
          return null;
        }

        const existUserInformation = await this.userInformationRepo.findOne({
          where: { user: existUser.id },
        });

        if (!existUserInformation) {
          throw new Error('User Info not found');
        }

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

  async getOwner(nftId: number) {
    const existNft = await this.nftRepo.findOne({ where: { tokenId: nftId } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    const userCreateNftHistory = await this.nftHistoryRepo.findOne({
      where: { tokenId: existNft.tokenId, historyType: History.SELL },
    });

    let userCreateNft = null;

    if (
      userCreateNftHistory.owner.toLowerCase() ===
      process.env.NFTMarketplaceAddress.toLowerCase()
    ) {
      userCreateNft = await this.userRepo.findOne({
        where: { account: userCreateNftHistory.seller.toLowerCase() },
      });
    } else {
      userCreateNft = await this.userRepo.findOne({
        where: { account: userCreateNftHistory.owner.toLowerCase() },
      });
    }

    const userCreateNftInformation = await this.userInformationRepo.findOne({
      where: { user: userCreateNft },
    });

    const existNftHistory = await this.nftHistoryRepo.find({
      where: { tokenId: existNft.tokenId },
    });

    const newHistory = existNftHistory.reverse();

    const owner = newHistory[0];

    let user = null;

    if (
      owner.owner.toLowerCase() ===
      process.env.NFTMarketplaceAddress.toLowerCase()
    ) {
      user = await this.userRepo.findOne({
        where: { account: owner.seller.toLowerCase() },
      });
    } else {
      user = await this.userRepo.findOne({
        where: { account: owner.owner.toLowerCase() },
      });
    }

    if (!user) {
      return null;
    }

    const existUserInformation = await this.userInformationRepo.findOne({
      where: { user: user.id },
    });

    if (!existUserInformation) {
      throw new Error('User Info not found');
    }

    return {
      ownerNft: {
        history: {
          id: owner.id,
          historyType: owner.historyType,
          createdAt: new Date(owner.createdAt).getTime(),
          owner: owner.owner,
          seller: owner.seller,
          price: owner.price,
          tokenId: owner.tokenId,
        },

        user: user,

        information: existUserInformation,
      },
      createNft: {
        history: {
          id: userCreateNftHistory.id,
          historyType: userCreateNftHistory.historyType,
          createdAt: new Date(userCreateNftHistory.createdAt).getTime(),
          owner: userCreateNftHistory.owner,
          seller: userCreateNftHistory.seller,
          price: userCreateNftHistory.price,
          tokenId: userCreateNftHistory.tokenId,
        },

        user: userCreateNft,

        information: userCreateNftInformation,
      },
    };
  }
}
