import customToken from "../artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "../artifacts/contracts/TranferToken.sol/TranferToken.json";
import ammSwap from "../artifacts/contracts/AMMSwap.sol/AMMSwap.json";
import nftCollection1155 from "../artifacts/contracts/NFTCollection1155.sol/NFTCollection1155.json";
import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import nftStaking from "../artifacts/contracts/NFTStaking.sol/NFTStaking.json";
import transferFunds from "../artifacts/contracts/TransferFunds.sol/TransferFunds.json";

export const DeployerAddress = "0x8A270109fD7D1D875EaA2B421D3Dc69eDe5Cc892";

export const CustomTokenAddress = "0x44afC3b694d7357A04d5Cd81Aa67f9032392Ac2D";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0x07Bd4aFfe598F6f43b9395665048918A2c2d8907";
export const TranferTokenABI = tranferToken.abi;

export const AmmSwapAddress = "0x7c25357F2A334e1D93feE661AfD2007b5395d3Ea";
export const AmmSwapABI = ammSwap.abi;

export const NFTCollection1155Address =
  "0x36A3F879dBa25afBb18F5140556a5f870D83BeFe";
export const NFTCollection1155ABI = nftCollection1155.abi;

export const NFTMarketplaceAddress =
  "0xBa49A766628AC4d3d161BC16fe7F6E79F8e8a2F6";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const NFTStakingAddress = "0x19ebCF92c474a8Df36635342BA6daB86fA2fD90C";
export const NFTStakingABI = nftStaking.abi;

export const TransferFundsAddress =
  "0xF83598296E6d42683EF8593317eEbE2006cA2abA";
export const TransferFundsABI = transferFunds.abi;
