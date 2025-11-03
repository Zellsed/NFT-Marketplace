require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.27",
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hoodi_ETH: {
      url: "https://hoodi.infura.io/v3/46a29745c9034ef89339cb8e2ed8f425",
      accounts: [
        `0x${"1557bfbc8a2c0cbf60840c233d2079fdadbd65b7d923f29c8ab00bfee96e119e"}`,
      ],
    },
    polygon_Amoy: {
      url: "https://polygon-amoy.infura.io/v3/46a29745c9034ef89339cb8e2ed8f425",
      accounts: [
        `0x${"1557bfbc8a2c0cbf60840c233d2079fdadbd65b7d923f29c8ab00bfee96e119e"}`,
      ],
    },
  },
};
