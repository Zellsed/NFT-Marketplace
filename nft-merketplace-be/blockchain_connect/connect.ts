import customToken from "./artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "./artifacts/contracts/TranferToken.sol/TranferToken.json";
import nftCollection1155 from "./artifacts/contracts/NFTCollection1155.sol/NFTCollection1155.json";
import nftMarketplace from "./artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import nftStaking from "./artifacts/contracts/NFTStaking.sol/NFTStaking.json";
import transferFunds from "./artifacts/contracts/TransferFunds.sol/TransferFunds.json";

export const CustomTokenAddress = "0xc692fAf6eC0F81E50e541AD8f02a1E23EAf3F00F";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0x3B62dc73454Dd730d1234FD9B9aCC3be779DB052";
export const TranferTokenABI = tranferToken.abi;

export const NFTCollection1155Address =
  "0x30F86945F2dDC34Ee62ABEf68b29B546582a1eD9";
export const NFTCollection1155ABI = nftCollection1155.abi;

export const NFTMarketplaceAddress =
  "0x7Fc3109989DB2511dd5cF450F0dd340fb9CC4d1f";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const NFTStakingAddress = "0x541d874CDF8a64b7394f074E73E7aDE8A62a0352";
export const NFTStakingABI = nftStaking.abi;

export const TransferFundsAddress =
  "0xE0a7076ae417e273AB0d22BC8412a73E8c015970";
export const TransferFundsABI = transferFunds.abi;

