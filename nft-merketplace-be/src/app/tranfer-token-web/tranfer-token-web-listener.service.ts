import { Injectable, OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers";
import { TranferTokenWebService } from "./tranfer-token-web.service";
import { TranferTokenAddress, TranferTokenABI } from "../../../blockchain_connect/connect";
import axios from "axios";

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(private readonly tranferTokenWebService: TranferTokenWebService) { }

  onModuleInit() {
    this.startListening();
  }

  private async startListening() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(TranferTokenAddress,
      TranferTokenABI,
      this.provider);

    this.contract.on(
      'buyTokenWeb',
      async (data) => {
        console.log('butTokenWeb event:', data);
        // try {
        //   const tx = await event.getTransaction();
        //   const block = await event.getBlock();

        //   console.log('butTokenWeb event:', userAddress);
        //   console.log('butTokenWeb event:', baseCoin);
        //   console.log('butTokenWeb event:', baseCoinAmount);
        //   console.log('butTokenWeb event:', webTokenAmount);
        //   console.log('butTokenWeb event:', tx);
        //   console.log('butTokenWeb event:', block);

        // } catch (error) {
        //   console.error('Error processing event:', error);
        // }
      }
    );
  }
}