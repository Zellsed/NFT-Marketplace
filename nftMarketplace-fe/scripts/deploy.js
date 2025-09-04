const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();

  // const owner = await nftMarketplace.owner();

  const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  const transferFunds = await TransferFunds.deploy();
  await transferFunds.deployed();

  // const NftAuction = await hre.ethers.getContractFactory("NftAuction");
  // const nftAuction = await NftAuction.deploy();
  // await nftAuction.deployed();

  console.log(`NFTMarketplace deployed to ${nftMarketplace.address}`);
  console.log(`TransferFunds deployed to ${transferFunds.address}`);
  // console.log(`NftAuction deployed to ${nftAuction.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
