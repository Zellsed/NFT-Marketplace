import { Injectable } from '@nestjs/common';
import {
  LikeRepository,
  NFT721MetadataRepository,
  NFT721StakingRepository,
  NftHistoryRepository,
  NFTRepository,
  UserInformationRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LikeEntity,
  Nft721Entity,
  Nft721MetadataEntity,
  Nft721StakingEntity,
  NftHistoryEntity,
  UserEntity,
  UserInformationEntity,
  UserSpentEntity,
} from 'src/core/lib/database/entities';
import { getListNFTDto, getNFTDto } from './dto/getNft.dto';

import { DefaultPaging, History, SpentType } from 'src/common/enum';
import slugify from 'slugify';
import { createNFTDTo, metadataNFTDto } from './dto/createNft.dto';
import { UserSpentRepository } from 'src/core/lib/database/repositories/userSpent.repository';
import { createNFTStakingDTo } from './dto/createNftStaking.dto';

@Injectable()
export class NftMarketplaceService {
  constructor(
    @InjectRepository(Nft721Entity)
    private readonly nftRepo: NFTRepository,

    @InjectRepository(Nft721MetadataEntity)
    private readonly nft721MetadataRepo: NFT721MetadataRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(UserInformationEntity)
    private readonly userInformationRepo: UserInformationRepository,

    @InjectRepository(NftHistoryEntity)
    private readonly nftHistoryRepo: NftHistoryRepository,

    @InjectRepository(LikeEntity)
    private readonly likeRepo: LikeRepository,

    @InjectRepository(UserSpentEntity)
    private readonly userSpentRepo: UserSpentRepository,

    @InjectRepository(Nft721StakingEntity)
    private readonly nft721StakingRepo: NFT721StakingRepository,
  ) { }

  async createNft721FromChain(
    createNft: createNFTDTo,
    nftData: metadataNFTDto,
    fee: number,
  ) {
    const tokenId = Number(createNft.tokenId);
    const price = Number(createNft.price) / 1e18;
    const feePrice = Number(fee);

    const existUser = await this.userRepo.findOne({
      where: { account: createNft.seller.toLowerCase() },
    });

    if (!existUser) {
      return;
    }

    const existMetadata = await this.nft721MetadataRepo.findOne({
      where: {
        tokenId: tokenId,
      },
    });

    if (existMetadata) {
      return;
    }

    const metadata = await this.nft721MetadataRepo.save({
      tokenId: tokenId,
      tokenURI: nftData.tokenURI,
      name: nftData.name,
      description: nftData.description,
      pinataData: nftData.pinataData,
      category: nftData.category,
      fileExtension: nftData.fileExtension,
      fileSize: nftData.fileSize,
    });

    const nft = await this.nftRepo.save({
      ...createNft,
      tokenId: tokenId,
      price: price,
      metadata: metadata,
    });

    await this.nftHistoryRepo.save({
      historyType: History.SELL,
      seller: createNft.seller,
      owner: createNft.owner,
      price: price,
      tokenId: tokenId,
      nft: nft,
    });

    await this.userSpentRepo.save({
      spent: feePrice,
      spentType: SpentType.FEE,
      user: existUser,
    });
  }

  async createSaleNft721FromChain(nftData: createNFTDTo, fee: number) {
    const tokenId = Number(nftData.tokenId);
    const price = Number(nftData.price);
    const feePrice = Number(fee);

    const existUser = await this.userRepo.findOne({
      where: { account: nftData.owner.toLowerCase() },
    });

    if (!existUser) {
      return;
    }

    const existNft721 = await this.nftRepo.findOne({
      where: {
        tokenId: tokenId,
        sold: false,
      },
    });

    if (!existNft721) {
      return;
    }

    await this.nftRepo.update(
      { tokenId: existNft721.tokenId },
      { owner: nftData.owner, seller: nftData.seller, sold: nftData.sold },
    );

    await this.nftHistoryRepo.save({
      historyType: History.BUY,
      seller: existNft721.seller,
      owner: nftData.owner,
      price: price,
      tokenId: tokenId,
      nft: existNft721,
    });

    await this.userSpentRepo.save({
      spent: feePrice,
      spentType: SpentType.FEE,
      user: existUser,
    });

    await this.userSpentRepo.save({
      spent: price,
      spentType: SpentType.BUY,
      user: existUser,
    });
  }

  async createNft721StakingFromChain(nftStakingData: createNFTStakingDTo) {
    const stakeId = Number(nftStakingData.stakeId);
    const tokenId = Number(nftStakingData.tokenId);
    const amount = Number(nftStakingData.amount);
    const duration = Number(nftStakingData.duration);

    const existNft721 = await this.nftRepo.findOne({
      where: {
        tokenId: tokenId,
        sold: true,
      },
    });

    if (!existNft721) {
      return;
    }

    const existNft721Staking = await this.nft721StakingRepo.findOne({
      where: {
        tokenId: tokenId,
      },
    });

    if (existNft721Staking) {
      return;
    }

    await this.nft721StakingRepo.save({
      staker: nftStakingData.staker,
      stakeId: stakeId,
      tokenId: tokenId,
      amount: amount,
      duration: duration,
    });
  }

  async getAllNfts(requestTime: string, body: getNFTDto) {
    const {
      page = DefaultPaging.PAGE,
      limit = DefaultPaging.LIMIT,
      sort,
      fields,
      name,
      duration,
      difficulty,
      ratingsAverage,
      ratingsQuantity,
      price,
      priceDiscount,
    } = body;

    const qb = this.nftRepo
      .createQueryBuilder('nft')
      .select([
        'nft.id' as 'id',
        'nft.token_id' as 'tokenId',
        'nft.seller' as 'seller',
        'nft.owner' as 'owner',
        'nft.price' as 'price',
        'nft.sold' as 'sold',
        'nft.metadata_id' as 'metadata_id',
        'metadata.token_uri' as 'token_uri',
        'metadata.name' as 'name',
        'metadata.description' as 'description',
        'metadata.pinata_data' as 'tokenURI',
        'metadata.category' as 'category',
        'metadata.file_extension' as 'fileExtension',
        'metadata.file_size' as 'fileSize',
        'nft.created_at' as 'created_at',
        'nft.updated_at' as 'updated_at',
      ])
      .leftJoin('nft.metadata', 'metadata')
      .andWhere('nft.sold = :sold', { sold: false })
      .orderBy('nft.created_at', 'DESC');

    const [data, totalRows] = await Promise.all([
      qb
        .offset((page - 1) * limit)
        .limit(limit)
        .getRawMany(),

      qb.getCount(),
    ]);

    const convertedData = await Promise.all(
      data.map(async (item) => {
        const existingNft = await this.nftRepo.findOne({
          where: { id: item.nft_id },
        });

        if (!existingNft) {
          throw new Error('Nft not found');
        }

        const existingLinkNft = await this.likeRepo.find({
          where: { nft: { id: existingNft.id } },
        });

        return {
          ...item,
          like: existingLinkNft.length,
        };
      }),
    );

    return {
      status: 'success',
      requestTime: requestTime,
      totalRows: totalRows,
      data: convertedData,
    };
  }

  async getSliderData(requestTime: string) {
    const data = this.getAllNfts(requestTime, { page: 1, limit: 5 });

    if (!data) {
      return;
    }

    const convertedData = await Promise.all(
      (await data).data.map(async (item) => {
        const existingNft = await this.nftRepo.findOne({
          where: { id: item.id },
        });

        if (!existingNft) {
          throw new Error('Nft not found');
        }

        const existingUser = await this.userRepo.findOne({
          where: { account: existingNft.seller.toLowerCase() },
        });

        if (!existingUser) {
          throw new Error('User not found');
        }

        const existingUserInformation = await this.userInformationRepo.findOne({
          where: { id: existingUser.id },
        });

        if (!existingUserInformation) {
          throw new Error('User Information not found');
        }

        return {
          ...item,
          user: existingUser,
          userInformation: existingUserInformation,
        };
      }),
    );

    return {
      status: 'success',
      requestTime: requestTime,
      data: convertedData,
    };
  }

  async getTotalTransactionMarketplaceAll() {
    const qb = this.userSpentRepo
      .createQueryBuilder('user_spent')
      .select('SUM(user_spent.spent)', 'totalSpent')
      .addSelect('COUNT(user_spent.id)', 'totalCount');

    const data = await qb.getRawOne();

    return {
      status: 'success',
      data: data,
    };
  }

  async getListNfts(requestTime: string, body: getListNFTDto) {
    const {
      page = DefaultPaging.PAGE,
      limit = DefaultPaging.LIMIT,
      name,
    } = body;

    const qb = this.nftRepo
      .createQueryBuilder('nft')
      .select([
        'nft.id' as 'id',
        'nft.name' as 'name',
        'nft.price' as 'price',
        'nft. description' as 'description',
        'nft.pinata_data' as 'pinata_data',
        'nft.category' as 'category',
        'nft.file_extension' as 'file_extension',
        'nft.owner' as 'owner',
        'nft.seller' as 'seller',
        'nft.token_id' as 'token_id',
        'nft.secret_nfts' as 'secret_nfts',
      ])
      .andWhere('nft.secret_nfts = :secret_nfts', { secret_nfts: false });

    const [data, totalRows] = await Promise.all([
      qb
        .offset((page - 1) * limit)
        .limit(limit)
        .getRawMany(),

      qb.getCount(),
    ]);

    return {
      status: 'success',
      requestTime: requestTime,
      totalRows: totalRows,
      data: data,
    };
  }

  async getNftStats() {
    const stats = await this.nftRepo
      .createQueryBuilder('nft')
      .select([
        'upper(nft.difficulty) as difficulty',
        'count(nft.id) as count_nft',
        'sum(nft.rating_quantity) as sum_rating_quantity',
        'avg(nft.rating_average) as rating_average',
        'avg(nft.price) as price',
        'min(nft.price) as min_price',
        'max(nft.price) as max_price',
      ])
      .where('nft.rating_average >= :minRating', { minRating: 4.5 })
      .andWhere('nft.secret_nfts = :secret_nfts', { secret_nfts: false })
      .groupBy('nft.difficulty')
      .getRawMany();

    return stats;
  }

  async getSingleNFT(id: number) {
    const idNumber = Number(id);

    const existNft = await this.nftRepo.findOne({
      where: { id: idNumber, sold: false },
    });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    return existNft;
  }

  async getMonthlyPlan(year: number) {
    const result = await this.nftRepo
      .createQueryBuilder('nft')
      .select([
        'EXTRACT(MONTH FROM dates.start_date) AS month',
        'COUNT(DISTINCT dates.name) AS numNFTStarts',
        'ARRAY_AGG(DISTINCT dates.name) AS nfts',
      ])
      .from((qb) => {
        return qb
          .select('unnest(nft.start_dates) AS start_date, nft.name')
          .from('nft', 'nft')
          .where('nft.start_dates IS NOT NULL');
      }, 'dates')
      .where('EXTRACT(YEAR FROM dates.start_date) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      status: 'success',
      data: result,
    };
  }

  async getCategoryNFT() {
    const categoryCounts = await this.nftRepo
      .createQueryBuilder('nft')
      .select('nft.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('nft.category')
      .getRawMany();

    return categoryCounts;
  }

  async getTopCreatorsByTotalSales() {
    const data = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const existUser = await this.userRepo.findOne({ where: { account: data } });

    if (!existUser) {
      throw new Error('User not found');
    }

    console.log('existUser', existUser);
  }

  async getUserNft(id: number) {
    // const existNft = await this.nftRepo.findOne({ where: { tokenId: id } });
    // if (!existNft) {
    //   throw new Error('Nft not found');
    // }
    // const nftOwnerUser = await this.userRepo.findOne({
    //   where: { id: existNft.user },
    // });
    // if (!nftOwnerUser) {
    //   throw new Error('User not found');
    // }
  }
}
