require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.5.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    testnet: {
      url: 'https://testnet.fpt-blockchain-lab.com/',
    },
    stagingnet: {
      url: 'https://stagingnet.fpt-blockchain-lab.com/',
    },
    productionnet: {
      url: 'https://productionnet.fpt-blockchain-lab.com/'
    }
  },

  etherscan: {
    apiKey: {
      testnet: 'my api key',
      stagingnet: 'my api key',
      productionnet: 'my api key'
    },
    customChains: [
      {
        network: "testnet",
        chainId: 6787,
        urls: {
          apiURL: "https://explorer-testnet.fpt-blockchain-lab.com/api",
          browserURL: "https://explorer-testnet.fpt-blockchain-lab.com/"
        }
      },
      {
        network: "stagingnet",
        chainId: 6788,
        urls: {
          apiURL: "https://explorer-staging.fpt-blockchain-lab.com/api",
          browserURL: "https://explorer-staging.fpt-blockchain-lab.com/"
        }
      },
      {
        network: "productionnet",
        chainId: 6789,
        urls: {
          apiURL: "https://explorer.fpt-blockchain-lab.com/api",
          browserURL: "https://explorer.fpt-blockchain-lab.com/"
        }
      },
    ]
  },
  paths: {
    sources: "./contract",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
