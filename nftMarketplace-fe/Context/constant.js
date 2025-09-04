import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import transferFunds from "../artifacts//contracts/TransferFunds.sol/TransferFunds.json";
import nftAuction from "../artifacts/contracts/BiddingContract.sol/NftAuction.json";

export const NFTMarketplaceAddress =
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const TransferFundsAddress =
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const TransferFundsABI = transferFunds.abi;

export const NftAuctionAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const NftAuctionABI = nftAuction.abi;
