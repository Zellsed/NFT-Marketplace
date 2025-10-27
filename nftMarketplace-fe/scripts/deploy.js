const hre = require("hardhat");

async function main() {
  const CustomToken = await hre.ethers.getContractFactory("CustomToken");
  const customToken = await CustomToken.deploy("Zell Token", "ZELL");
  await customToken.deployed();

  const TranferToken = await hre.ethers.getContractFactory("TranferToken");
  const tranferToken = await TranferToken.deploy(customToken.address);
  await tranferToken.deployed();

  const price = ethers.utils.parseUnits("10000000", 18);
  await customToken.approve(tranferToken.address, price);
  await tranferToken.depositToken(price);

  const NFTCollection1155 = await hre.ethers.getContractFactory(
    "NFTCollection1155"
  );
  const nftCollection1155 = await NFTCollection1155.deploy();
  await nftCollection1155.deployed();

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(
    customToken.address,
    nftCollection1155.address
  );
  await nftMarketplace.deployed();

  const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  const transferFunds = await TransferFunds.deploy();
  await transferFunds.deployed();

  console.log(`CustomToken deployed to ${customToken.address}`);
  console.log(`TranferToken deployed to ${tranferToken.address}`);
  console.log("NFTCollection1155 deployed to:", nftCollection1155.address);
  console.log(`NFTMarketplace deployed to ${nftMarketplace.address}`);
  console.log(`TransferFunds deployed to ${transferFunds.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
