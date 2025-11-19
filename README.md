# NFT Marketplace - Decentralized Web3 Platform

![Genesis Project](./public/img/nft%20marketplace.png)

A full-stack, multi-chain NFT marketplace enabling users to mint, buy, sell, and stake digital assets securely on the blockchain. Built with Next.js for the frontend, Solidity smart contracts deployed via Hardhat, Ethers.js for Web3 interactions, and Alchemy Provider for mainnet connectivity. The backend uses NestJS with PostgreSQL for off-chain data management, API endpoints, and real-time event listening from smart contracts. This project demonstrates DeFi-inspired features like token economies and staking rewards.

## Introduction

This is a decentralized NFT marketplace project designed for blockchain enthusiasts and developers. It integrates on-chain smart contracts with off-chain backend services, allowing seamless user experiences for creating and trading NFTs. Key highlights:
- Supports ERC721 (unique NFTs) and ERC1155 (multi-edition NFTs).
- Uses ERC20 for platform tokens, enabling purchases with ETH/Polygon.
- Includes staking mechanisms where users can stake NFTs to earn rewards.
- Backend listens to blockchain events (e.g., mint, transfer) and syncs data to PostgreSQL in real-time.

The project is ideal for learning Web3 development and can be extended for production use.

## Features

- **NFT Minting and Trading**: Users can mint ERC721/ERC1155 NFTs, list them for sale, and buy with multi-chain support (ETH/Polygon).
- **Platform Token (ERC20)**: Custom token for transaction fees, royalties, and governance; purchasable with native coins like ETH.
- **Staking Rewards**: Stake NFTs to earn token rewards, simulating DeFi farming mechanics.
- **Wallet Integration**: Connect MetaMask or other wallets via Ethers.js for secure transactions.
- **Off-Chain Backend**: NestJS handles API requests, event listening from smart contracts, and data storage in PostgreSQL (using TypeORM for schemas and migrations).
- **Real-Time Sync**: Backend subscribes to blockchain events to update database instantly.
- **API Documentation**: RESTful APIs tested with Postman.

## Architecture

The system follows a hybrid on-chain/off-chain design:
