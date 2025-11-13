import { Injectable, OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers";
import { NftMarketplaceService } from "./nft-marketplace.service";
import { NFTMarketplaceAddress, NFTMarketplaceABI } from "../../../blockchain_connect/connect";
import axios from "axios";

@Injectable()
export class NftMarketplaceListenerService implements OnModuleInit {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(private readonly nftMarketplaceService: NftMarketplaceService) { }

  onModuleInit() {
    this.startListening();
  }

  private async startListening() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(NFTMarketplaceAddress,
      NFTMarketplaceABI,
      this.provider);

    this.contract.on(
      'idMarketItemCreated',
      async (tokenId, seller, owner, price, sold, event) => {
        try {
          const tx = await event.getTransaction();
          const block = await event.getBlock();

          const nftData = await this.fetchNFTData(tokenId);

          const createNft = {
            tokenId,
            seller,
            owner,
            price,
            sold,
          }

          const metadata = {
            tokenId,
            tokenURI: nftData.tokenURI,
            ...nftData.metadata
          }

          await this.nftMarketplaceService.createNft721FromChain(createNft, metadata);

        } catch (error) {
          console.error('Error processing event:', error);
        }
      }
    );
  }

  private async fetchNFTData(tokenId: number) {
    const tokenURI = await this.contract.tokenURI(tokenId);

    const { data } = await axios.get(tokenURI);

    const metadata = typeof data === "string" ? JSON.parse(data) : data;

    return {
      tokenURI,
      metadata
    };
  }
}