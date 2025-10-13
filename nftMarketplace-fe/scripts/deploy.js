const hre = require("hardhat");

async function main() {
  const CustomToken = await hre.ethers.getContractFactory("CustomToken");
  const customToken = await CustomToken.deploy("Zell Token", "ZELL");
  await customToken.deployed();

  const TranferToken = await hre.ethers.getContractFactory("TranferToken");
  const tranferToken = await TranferToken.deploy(customToken.address);
  await tranferToken.deployed();

  await customToken.approve(tranferToken.address, "10000000000000000000000000");

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(tranferToken.address);
  await nftMarketplace.deployed();

  const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  const transferFunds = await TransferFunds.deploy();
  await transferFunds.deployed();

  // const NftAuction = await hre.ethers.getContractFactory("NftAuction");
  // const nftAuction = await NftAuction.deploy();
  // await nftAuction.deployed();

  // await tranferToken.depositToken("5000000000000000000000000");

  console.log(`NFTMarketplace deployed to ${nftMarketplace.address}`);
  console.log(`TransferFunds deployed to ${transferFunds.address}`);
  // console.log(`NftAuction deployed to ${nftAuction.address}`);
  console.log(`CustomToken deployed to ${customToken.address}`);
  console.log(`TranferToken deployed to ${tranferToken.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
