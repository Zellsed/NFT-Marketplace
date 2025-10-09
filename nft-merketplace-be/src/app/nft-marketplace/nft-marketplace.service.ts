import { Injectable } from '@nestjs/common';
import {
  NftHistoryRepository,
  NFTRepository,
  UserRepository,
} from 'src/core/lib/database/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NftEntity,
  NftHistoryEntity,
  UserEntity,
} from 'src/core/lib/database/entities';
import { getListNFTDto, getNFTDto } from './dto/getNft.dto';
import { createNFTDto } from './dto/createNft.dto';
import { updateNFTDto } from './dto/updateNft.dto';
import { DefaultPaging, History } from 'src/common/enum';
import slugify from 'slugify';
import { buyNFTDto, resellNFTDto } from './dto/buyNft.dto';

@Injectable()
export class NftMarketplaceService {
  constructor(
    @InjectRepository(NftEntity)
    private readonly nftRepo: NFTRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,

    @InjectRepository(NftHistoryEntity)
    private readonly nftHistoryRepo: NftHistoryRepository,
  ) {}

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
        'nft.name' as 'name',
        'nft.slug' as 'slug',
        'nft.duration' as 'duration',
        'nft.max_group_size' as 'max_group_size',
        'nft.difficulty' as 'difficulty',
        'nft.rating_average' as 'rating_average',
        'nft.rating_quantity' as 'rating_quantity',
        'nft.price' as 'price',
        'nft.price_discount' as 'price_discount',
        'nft.summary' as 'summary',
        'nft.description' as 'description',
        'nft.image_cover' as 'image_cover',
        'nft.images' as 'images',
        'nft.created_at' as 'created_at',
        'nft.start_dates' as 'start_dates',
        'nft.secret_nfts' as 'secret_nfts',
      ])
      .andWhere('nft.secret_nfts = :secret_nfts', { secret_nfts: false });

    if (fields) {
      const selectedFields = fields
        .split(',')
        .map((field) => `nft.${field.trim()}`);
      qb.select(selectedFields);
    }

    // if (fields) {
    //   const excludedFields = fields
    //     .split(',')
    //     .map((field) => `nft.${field.trim()}`);

    //   const selectedFields = qb.expressionMap.selects
    //     .map((select) => select.selection)
    //     .filter((field) => !excludedFields.includes(field));
    //   qb.select(selectedFields);
    // }

    if (name) {
      qb.andWhere('nft.name = :name', { name });
    }
    if (duration) {
      qb.andWhere('nft.duration = :duration', { duration });
    }
    if (difficulty) {
      qb.andWhere('nft.difficulty = :difficulty', { difficulty });
    }
    if (ratingsAverage) {
      qb.andWhere('nft.rating_average = :ratingsAverage', { ratingsAverage });
    }
    if (ratingsQuantity) {
      qb.andWhere('nft.rating_quantity = :ratingsQuantity', {
        ratingsQuantity,
      });
    }
    if (price) {
      qb.andWhere('nft.price = :price', { price });
    }
    // if (priceDiscount) {
    //   qb.andWhere('nft.price_discount = :priceDiscount', { priceDiscount });
    // }

    if (sort) {
      const sortFields = sort.split(',');

      sortFields.forEach((fields) => {
        const orderDirection = fields.startsWith('-') ? 'DESC' : 'ASC';
        const sortField = fields.replace('-', '');

        qb.addOrderBy(`nft.${sortField}`, orderDirection);
      });
    } else {
      qb.orderBy('nft.created_at', 'DESC');
    }

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

  async createNft(userId: number, body: createNFTDto) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const newNft = await this.nftRepo.save({
      name: body.name,
      price: body.price,
      description: body.description,
      pinataData: body.pinataData,
      category: body.category,
      fileExtension: body.fileExtension,
      fileSize: body.fileSize,
      createdAt: body.createdAt,
      seller: body.seller.toLowerCase(),
      owner: body.owner.toLowerCase(),
      user: existUser,
      tokenId: body.tokenId,
    });

    await this.nftHistoryRepo.save({
      seller: body.seller.toLowerCase(),
      owner: body.owner.toLowerCase(),
      nft: newNft,
      tokenId: body.tokenId,
      historyType: History.SELL,
      price: body.price,
    });

    return newNft;
  }

  async buyNft(userId: number, body: buyNFTDto) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existNft = await this.nftRepo.findOne({
      where: { tokenId: Number(body.nftId) },
    });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    await this.nftRepo.update(existNft.id, {
      user: existUser,
      owner: body.owner.toLowerCase(),
      seller: body.seller.toLowerCase(),
    });

    await this.nftHistoryRepo.save({
      seller: body.seller.toLowerCase(),
      owner: body.owner.toLowerCase(),
      nft: existNft,
      tokenId: existNft.tokenId,
      historyType: History.BUY,
      price: existNft.price,
    });
  }

  async resellNft(userId: number, body: resellNFTDto) {
    const existUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!existUser) {
      throw new Error('User not found');
    }

    const existNft = await this.nftRepo.findOne({
      where: { tokenId: body.tokenId },
    });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    await this.nftRepo.update(existNft.id, {
      user: existUser,
      owner: body.owner.toLowerCase(),
      seller: body.seller.toLowerCase(),
      price: Number(body.price),
    });

    await this.nftHistoryRepo.save({
      seller: body.seller.toLowerCase(),
      owner: body.owner.toLowerCase(),
      nft: existNft,
      tokenId: existNft.tokenId,
      historyType: History.RESELL,
      price: Number(body.price),
    });
  }

  async getSingleNFT(id: number) {
    const idNumber = Number(id);

    const existNft = await this.nftRepo.findOne({
      where: { id: idNumber, secretNfts: false },
    });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    return existNft;
  }

  async updateNFT(id: number, body: updateNFTDto) {
    const existNft = await this.nftRepo.findOne({ where: { id: id } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    await this.nftRepo.update(id, body);

    const existNftUpdate = await this.nftRepo.findOne({ where: { id: id } });

    return existNftUpdate;
  }

  async deleteNFT(id: number) {
    await this.nftRepo.delete(id);

    return { status: 'success', message: 'Delete successfully' };
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
    const existNft = await this.nftRepo.findOne({ where: { tokenId: id } });

    if (!existNft) {
      throw new Error('Nft not found');
    }

    const nftOwnerUser = await this.userRepo.findOne({
      where: { id: existNft.user },
    });

    if (!nftOwnerUser) {
      throw new Error('User not found');
    }
  }
}
