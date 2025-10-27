import customToken from "../artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "../artifacts/contracts/TranferToken.sol/TranferToken.json";
import nftCollection1155 from "../artifacts/contracts/NFTCollection1155.sol/NFTCollection1155.json";
import nftMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import transferFunds from "../artifacts//contracts/TransferFunds.sol/TransferFunds.json";

export const CustomTokenAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
export const TranferTokenABI = tranferToken.abi;

export const NFTCollection1155Address =
  "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
export const NFTCollection1155ABI = nftCollection1155.abi;

export const NFTMarketplaceAddress =
  "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const TransferFundsAddress =
  "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
export const TransferFundsABI = transferFunds.abi;
