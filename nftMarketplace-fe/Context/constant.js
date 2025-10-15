import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import transferFunds from "../artifacts//contracts/TransferFunds.sol/TransferFunds.json";
import nftAuction from "../artifacts/contracts/BiddingContract.sol/NftAuction.json";
import customToken from "../artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "../artifacts/contracts/TranferToken.sol/TranferToken.json";

export const NFTMarketplaceAddress =
  "0x78dE7600b10C2957fce9427dED836B32E27E2d4b";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const TransferFundsAddress =
  "0xD7477473077F50e0aA2791c85bc557fbE03479df";
export const TransferFundsABI = transferFunds.abi;

// export const NftAuctionAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// export const NftAuctionABI = nftAuction.abi;

export const CustomTokenAddress = "0xF9537F8B1b3182CdE1dc02989d979ba0c754c0AD";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0x13E4ddA615DE8D7a3Ae499f94B0C454b2488eDFe";
export const TranferTokenABI = tranferToken.abi;
