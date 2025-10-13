require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    // sepolia_ETH: {
    //   url: "https://eth-sepolia.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj",
    //   accounts: [
    //     `0x${"bab5a6356dd7d87959287261acca67993661aa0256db48a6dfa6d11d37d5e5cb"}`,
    //   ],
    // },
    holesky_ETH: {
      url: "https://eth-holesky.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj",
      accounts: [
        `0x${"1557bfbc8a2c0cbf60840c233d2079fdadbd65b7d923f29c8ab00bfee96e119e"}`,
      ],
    },
  },
};