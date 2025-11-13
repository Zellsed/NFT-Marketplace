import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranferTokenWebEntity } from 'src/core/lib/database/entities';
import { tranferTokenWebRepository } from 'src/core/lib/database/repositories';
import { createTranferTokenWebDTo } from './dto/createTranferTokenWeb.dto';

@Injectable()
export class TranferTokenWebService {
  constructor(
    @InjectRepository(TranferTokenWebEntity)
    private readonly tranferTokenWebRepo: tranferTokenWebRepository
  ) { }


  async createTranferTokenWebHistory(createTranferTokenWeb: createTranferTokenWebDTo) {
    const baseCoinAmount = Number(createTranferTokenWeb.baseCoinAmount) / 1e18;
    const webTokenAmount = Number(createTranferTokenWeb.webTokenAmount);

    const existing = await this.tranferTokenWebRepo.findOne({
      where: { transactionHash: createTranferTokenWeb.transactionHash, logIndex: createTranferTokenWeb.logIndex }
    })

    if (existing) {
      return;
    }

    await this.tranferTokenWebRepo.save({
      userAddress: createTranferTokenWeb.userAddress,
      baseCoin: createTranferTokenWeb.baseCoin,
      baseCoinAmount,
      webTokenAmount,
      transactionHash: createTranferTokenWeb.transactionHash,
      logIndex: createTranferTokenWeb.logIndex,
      blockNumber: createTranferTokenWeb.blockNumber,
      blockHash: createTranferTokenWeb.blockHash
    });
  }

  async getTranferTokenWebHistory() {
    return await this.tranferTokenWebRepo.find({
      order: { createdAt: 'DESC' }
    });
  }
}
