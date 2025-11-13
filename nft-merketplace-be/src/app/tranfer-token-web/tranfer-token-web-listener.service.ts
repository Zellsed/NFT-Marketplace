import { Injectable, OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers";
import { TranferTokenWebService } from "./tranfer-token-web.service";
import { TranferTokenAddress, TranferTokenABI } from "../../../blockchain_connect/connect";
import axios from "axios";

@Injectable()
export class TranferTokenWebListenerService implements OnModuleInit {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(private readonly tranferTokenWebService: TranferTokenWebService) { }

  onModuleInit() {
    this.startListening();
  }

  private isListening = false;

  private async startListening() {
    if (this.isListening) return;
    this.isListening = true;
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(TranferTokenAddress,
      TranferTokenABI,
      this.provider);

    this.contract.on(
      'buyTokenWeb',
      async (userAddress, baseCoin, baseCoinAmount, webTokenAmount, event) => {
        try {
          const tx = await event.getTransaction();
          const block = await event.getBlock();

          const transactionHash = event.transactionHash ?? tx.hash;
          const blockNumber = event.blockNumber ?? tx.blockNumber;
          const blockHash = event.blockHash ?? tx.blockHash;
          const logIndex = event.logIndex ?? 0;

          const data = {
            userAddress,
            baseCoin,
            baseCoinAmount,
            webTokenAmount,
            transactionHash,
            logIndex,
            blockNumber,
            blockHash,
          }

          await this.tranferTokenWebService.createTranferTokenWebHistory(data);

        } catch (error) {
          console.error('Error processing event:', error);
        }
      }
    );
  }
}