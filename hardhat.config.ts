require("dotenv").config();

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-abi-exporter";
import "@typechain/hardhat";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    compilers: [
      {
        version: "0.5.2",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.7.3",
      },
      {
        version: "0.7.5",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  networks: {
    hardhat: {
      gas: 60000000,
      chainId: 1,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      forking: {
        //"https://eth-mainnet.alchemyapi.io/v2/UJwzHuOAu9vEZ6M4pBgsyb44Ef7PyCc3",
        url: "https://polygon-mainnet.g.alchemy.com/v2/7Iz6OzPC0Kac5lINPxEIBmwkaFk1Ue7b",
        //13820000,
        blockNumber: 23031796,
      },
    },
    local: {
      url: process.env.LOCAL_URL || "http://127.0.0.1:8545",
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/UJwzHuOAu9vEZ6M4pBgsyb44Ef7PyCc3",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/7Iz6OzPC0Kac5lINPxEIBmwkaFk1Ue7b",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 1000 * 1000 * 1000 * 700,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 55,
    coinmarketcap: "71a0e4d4-2872-4441-8dda-97464b6d5e55",
    token: "ETH",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  abiExporter: {
    path: "./build",
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
  },
  mocha: {
    timeout: 5000000,
  },
};
