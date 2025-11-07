const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Mint 10M tokens
  const CustomToken = await hre.ethers.getContractFactory("CustomToken");
  const customToken = await CustomToken.deploy("Zell Token", "ZELL");
  await customToken.deployed();

  const TranferToken = await hre.ethers.getContractFactory("TranferToken");
  const tranferToken = await TranferToken.deploy(customToken.address);
  await tranferToken.deployed();

  // 8M tokens
  const price = ethers.utils.parseUnits("8000000", 18);

  console.log("Deployer:", deployer.address);
  console.log("Approving token for TranferToken...");

  await (
    await customToken.connect(deployer).approve(tranferToken.address, price)
  ).wait();

  const allowance = await customToken.allowance(
    deployer.address,
    tranferToken.address
  );
  console.log(
    `Allowance for TranferToken: ${allowance.toString() / 1e18} ZELL`
  );
  console.log("Depositing 8M tokens into TranferToken...");

  await (await tranferToken.connect(deployer).depositToken(price)).wait();

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

  const NFTStaking = await hre.ethers.getContractFactory("NFTStaking");
  const nftStakinge = await NFTStaking.deploy(
    customToken.address,
    nftMarketplace.address,
    nftCollection1155.address
  );
  await nftStakinge.deployed();

  const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  const transferFunds = await TransferFunds.deploy();
  await transferFunds.deployed();

  console.log(`CustomToken deployed to ${customToken.address}`);
  console.log(`TranferToken deployed to ${tranferToken.address}`);
  console.log("NFTCollection1155 deployed to:", nftCollection1155.address);
  console.log(`NFTMarketplace deployed to ${nftMarketplace.address}`);
  console.log(`NFTStaking deployed to ${nftStakinge.address}`);
  console.log(`TransferFunds deployed to ${transferFunds.address}`);

  console.log(
    "Approving NFTMarketplace to spend WEB tokens (for listing fees)..."
  );

  // 2M tokens
  const rewardPoolAmount = ethers.utils.parseUnits("2000000", 18);
  await customToken
    .connect(deployer)
    .approve(nftStakinge.address, rewardPoolAmount);
  console.log(
    `Approved ${rewardPoolAmount / 1e18} ZELL for NFTStaking reward pool`
  );
  console.log("Depositing initial reward pool into NFTStaking...");

  await nftStakinge.connect(deployer).depositReward(rewardPoolAmount);
  console.log(
    `Deposited ${rewardPoolAmount / 1e18} ZELL into staking reward pool`
  );
  console.log("Deployment + Approvals + Reward Pool Setup COMPLETED!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
