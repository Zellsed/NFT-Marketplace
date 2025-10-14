import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import transferFunds from "../artifacts//contracts/TransferFunds.sol/TransferFunds.json";
import nftAuction from "../artifacts/contracts/BiddingContract.sol/NftAuction.json";
import customToken from "../artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "../artifacts/contracts/TranferToken.sol/TranferToken.json";

export const NFTMarketplaceAddress =
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const TransferFundsAddress =
  "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
export const TransferFundsABI = transferFunds.abi;

// export const NftAuctionAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// export const NftAuctionABI = nftAuction.abi;

export const CustomTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const TranferTokenABI = tranferToken.abi;
