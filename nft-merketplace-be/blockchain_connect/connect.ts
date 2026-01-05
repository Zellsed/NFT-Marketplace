import customToken from "./artifacts/contracts/TranferToken.sol/CustomToken.json";
import tranferToken from "./artifacts/contracts/TranferToken.sol/TranferToken.json";
import nftCollection1155 from "./artifacts/contracts/NFTCollection1155.sol/NFTCollection1155.json";
import nftMarketplace from "./artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import nftStaking from "./artifacts/contracts/NFTStaking.sol/NFTStaking.json";
import transferFunds from "./artifacts/contracts/TransferFunds.sol/TransferFunds.json";

export const CustomTokenAddress = "0xCaf870cF8C6258A27F1a79C44b5c16f7a5D14db8";
export const CustomTokenABI = customToken.abi;

export const TranferTokenAddress = "0xf532dde5f5648Efa63Ef106aDc43b4FE42D5ce44";
export const TranferTokenABI = tranferToken.abi;

export const NFTCollection1155Address =
  "0x855c00b03d4307F71b40C32A660ed39d38a553E5";
export const NFTCollection1155ABI = nftCollection1155.abi;

export const NFTMarketplaceAddress =
  "0x5F1E84b03c12d085B7f9f6947389EFAB8722B912";
export const NFTMarketplaceABI = nftMarketplace.abi;

export const NFTStakingAddress = "0x53BF06895DeeA5B0e2080fA69C1e70d664993f41";
export const NFTStakingABI = nftStaking.abi;

export const TransferFundsAddress =
  "0x53706965d0A45679A74B60BD2b1B5C1d3974Bef1";
export const TransferFundsABI = transferFunds.abi;