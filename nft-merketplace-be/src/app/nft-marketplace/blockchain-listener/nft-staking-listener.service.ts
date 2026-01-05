import { Injectable, OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers";
import { NftMarketplaceService } from "../nft-marketplace.service";
import { NFTStakingAddress, NFTStakingABI } from "../../../../blockchain_connect/connect";
import axios from "axios";

@Injectable()
export class NFTStakingListenerService implements OnModuleInit {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(private readonly nftMarketplaceService: NftMarketplaceService) { }

  onModuleInit() {
    this.startListening();
  }

  private async startListening() {
    this.provider = new ethers.WebSocketProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(NFTStakingAddress,
      NFTStakingABI,
      this.provider);

    this.contract.on(
      'Staked',
      async (staker, stakeId, tokenId, amount, duration, event) => {
        try {
          const tx = await event.getTransaction();
          const block = await event.getBlock();

          const nftStakingData = {
            staker,
            stakeId,
            tokenId,
            amount,
            duration,
          }

          await this.nftMarketplaceService.createNft721StakingFromChain(nftStakingData);

        } catch (error) {
          console.error('Error processing event:', error);
        }
      }
    );
  }
}