import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import transferFunds from "../artifacts//contracts/TransferFunds.sol/TransferFunds.json";
import nftAuction from "../artifacts/contracts/BiddingContract.sol/NftAuction.json";

export const NFTMarketplaceAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const TransferFundsAddress =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const TransferFundsABI = transferFunds.abi;

export const NftAuctionAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const NftAuctionABI = nftAuction.abi;
