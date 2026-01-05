import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { NftMarketplaceService } from '../nft-marketplace.service';
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  NFTCollection1155Address,
  NFTCollection1155ABI,
} from '../../../../blockchain_connect/connect';
import axios from 'axios';

@Injectable()
export class NftMarketplaceListenerService implements OnModuleInit {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private contractNft1155: ethers.Contract;

  constructor(private readonly nftMarketplaceService: NftMarketplaceService) { }

  onModuleInit() {
    this.startListening();
  }

  private async startListening() {
    this.provider = new ethers.WebSocketProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(
      NFTMarketplaceAddress,
      NFTMarketplaceABI,
      this.provider,
    );
    this.contractNft1155 = new ethers.Contract(
      NFTCollection1155Address,
      NFTCollection1155ABI,
      this.provider,
    );

    this.contract.on(
      'idMarketItemCreated',
      async (tokenId, seller, owner, price, sold, event) => {
        try {
          const tx = await event.getTransaction();
          const block = await event.getBlock();

          const nftData = await this.fetchNFTData(tokenId);

          const fee = await this.feeNFTMarketplace();

          const createNft = {
            tokenId,
            seller,
            owner,
            price,
            sold,
          };

          const metadata = {
            tokenId,
            tokenURI: nftData.tokenURI,
            ...nftData.metadata,
          };

          await this.nftMarketplaceService.createNft721FromChain(
            createNft,
            metadata,
            fee,
          );
        } catch (error) {
          console.error('Error processing event:', error);
        }
      },
    );

    this.contract.on(
      'idMarketSaleCreated',
      async (tokenId, seller, owner, price, sold, event) => {
        try {
          const tx = await event.getTransaction();
          const block = await event.getBlock();

          const fee = await this.feeNFTMarketplace();

          const nftData = {
            tokenId,
            seller,
            owner,
            price,
            sold,
          };

          await this.nftMarketplaceService.createSaleNft721FromChain(
            nftData,
            fee,
          );
        } catch (error) {
          console.error('Error processing event:', error);
        }
      },
    );

    this.contract.on(
      'idMarketreSellTokenCreated',
      async (tokenId, seller, owner, price, sold, event) => {
        try {
          const tx = await event.getTransaction();
          const block = await event.getBlock();

          const fee = await this.feeNFTMarketplace();

          const createNft = {
            tokenId,
            price,
            seller,
            owner,
            sold,
          };

          await this.nftMarketplaceService.createReSaleNft721FromChain(
            createNft,
            fee,
          );
        } catch (error) {
          console.error('Error processing event:', error);
        }
      },
    );

    this.contract.on(
      'MarketItem1155Created',
      async (
        itemId,
        nftContract,
        tokenId,
        amount,
        amountAvailable,
        totalPrice,
        price,
        seller,
        owner,
        sold,
        event,
      ) => {
        try {
          console.log('event', event);
          const txHash = event.log.transactionHash;
          const logIndex = event.log.index;

          const nftData = await this.fetchNFT1155Data(tokenId);

          const fee = await this.feeNFTMarketplace();

          const createNft1155 = {
            itemId,
            tokenId,
            nftContract,
            seller,
            owner,
            amount,
            amountAvailable,
            totalPrice,
            price,
            sold,
            txHash,
            logIndex
          };

          const metadata = {
            tokenId,
            tokenURI: nftData.tokenURI,
            ...nftData.metadata,
          };

          await this.nftMarketplaceService.createNft1155FromChain(
            createNft1155,
            metadata,
            fee,
          )
        } catch (error) {
          console.error('Error processing event:', error);
        }
      },
    );

    this.contract.on(
      'MarketItem1155Sold',
      async (
        itemId,
        tokenId,
        amountBought,
        price,
        seller,
        buyer,
        event,
      ) => {
        try {
          const txHash = event.log.transactionHash;
          const logIndex = event.log.index;

          const fee = await this.feeNFTMarketplace();

          const nftData = {
            itemId,
            tokenId,
            seller,
            buyer,
            amountBought,
            price,
            txHash,
            logIndex
          };

          await this.nftMarketplaceService.createBuyNft1155FromChain(nftData, fee);
        } catch (error) {
          console.error('Error processing event:', error);
        }
      },
    );

    this.contract.on(
      'MarketItem1155Relisted',
      async (
        itemId,
        nftContract,
        tokenId,
        amount,
        amountAvailable,
        totalPrice,
        price,
        seller,
        owner,
        sold,
        event,
      ) => {
        try {
          const txHash = event.log.transactionHash;
          const logIndex = event.log.index;

          const nftData = await this.fetchNFT1155Data(tokenId);

          const fee = await this.feeNFTMarketplace();

          const createNft1155 = {
            itemId,
            tokenId,
            nftContract,
            seller,
            owner,
            amount,
            amountAvailable,
            totalPrice,
            price,
            sold,
            txHash,
            logIndex
          };

          const metadata = {
            tokenId,
            tokenURI: nftData.tokenURI,
            ...nftData.metadata,
          };
        } catch (error) {
          console.error('Error processing event:', error);
        }
      },
    );
  }

  private async fetchNFTData(tokenId: number) {
    const tokenURI = await this.contract.tokenURI(tokenId);

    const { data } = await axios.get(tokenURI);

    const metadata = typeof data === 'string' ? JSON.parse(data) : data;

    return {
      tokenURI,
      metadata,
    };
  }

  private async fetchNFT1155Data(tokenId: number) {
    const tokenURI = await this.contractNft1155.uri(tokenId);

    const { data } = await axios.get(tokenURI);

    const metadata = typeof data === 'string' ? JSON.parse(data) : data;

    return {
      tokenURI,
      metadata,
    };
  }

  private async feeNFTMarketplace() {
    const fee = await this.contract.getListingPrice();

    return fee;
  }
}
