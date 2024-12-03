import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const account = [process.env.PRIVATE_KEY!]

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          }
        }
      },
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      mining: {
        auto: true
      }
    },
    pregobi: {
      url: "http://evm-tn-pre-gobi-test-1.de.horizenlabs.io/ethv1",
      accounts: account
    },
    gobi: {
      url: "https://rpc.ankr.com/horizen_gobi_testnet",
      accounts: account
    },
    eon: {
      url: "https://eon-rpc.horizenlabs.io/ethv1",
      accounts: account
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: account
    },
    curtis: {
      url: "https://rpc.curtis.apechain.com",
      accounts: account
    }
  }
};

export default config;
