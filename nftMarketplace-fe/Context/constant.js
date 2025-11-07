import customToken from "../artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "../artifacts/contracts/TranferToken.sol/TranferToken.json";
import nftCollection1155 from "../artifacts/contracts/NFTCollection1155.sol/NFTCollection1155.json";
import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import nftStaking from "../artifacts/contracts/NFTStaking.sol/NFTStaking.json";
import transferFunds from "../artifacts//contracts/TransferFunds.sol/TransferFunds.json";

export const CustomTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const TranferTokenABI = tranferToken.abi;

export const NFTCollection1155Address =
  "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
export const NFTCollection1155ABI = nftCollection1155.abi;

export const NFTMarketplaceAddress =
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const NFTStakingAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
export const NFTStakingABI = nftStaking.abi;

export const TransferFundsAddress =
  "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
export const TransferFundsABI = transferFunds.abi;
