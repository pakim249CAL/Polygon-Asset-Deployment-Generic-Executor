require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-abi-exporter");
require('@typechain/hardhat')

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
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.2"
      },
      {
        version: "0.6.12"
      },
      {
        version: "0.7.3"
      },
      {
        version: "0.7.5"
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
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/UJwzHuOAu9vEZ6M4pBgsyb44Ef7PyCc3",
          //"https://polygon-mainnet.g.alchemy.com/v2/7Iz6OzPC0Kac5lINPxEIBmwkaFk1Ue7b",
        blockNumber: 13820000,
        //22646545,
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
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    kovan: {
      url: process.env.KOVAN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/7Iz6OzPC0Kac5lINPxEIBmwkaFk1Ue7b",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 1000 * 1000 * 1000 * 50,
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
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
