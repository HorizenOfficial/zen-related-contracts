// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import hre from "hardhat";
import * as dotenv from "dotenv";
import { OFT } from "../typechain-types";
import { Contract } from "ethers";

dotenv.config();

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

async function _printBalances(signer: any, ocToken: Contract, ocSigner: any) {

  let nativeBalance = await signer.provider.getBalance(signer.address);
  console.log("native balance on chain:", nativeBalance.toString());

  let ocBalance = await ocToken.connect(ocSigner).balanceOf(ocSigner.address);
  console.log("token balance on other chain:", ocBalance.toString());

}

async function main() {
  const signer = (await hre.ethers.getSigners())[0];
  const ocProvider = new hre.ethers.providers.JsonRpcProvider(process.env.OTHER_CHAIN_RPC!);
  const ocSigner = new hre.ethers.Wallet(process.env.OTHER_CHAIN_PRIVATE_KEY!, ocProvider);

  const OFT = await hre.ethers.getContractFactory("OFT");
  const token = OFT.attach(process.env.CHAIN_TOKEN_ADDRESS!);
  const ocToken = OFT.attach(process.env.OTHER_CHAIN_TOKEN_ADDRESS!).connect(ocSigner);

  await _printBalances(signer, ocToken, ocSigner);
  
  //from chain to other chain, with value since is native
  const tx = await token.sendFrom(
  )
  console.log(`waiting for tx: ${tx.hash}`);
  await tx.wait();

  await _printBalances(signer, ocToken, ocSigner);

  //fromm other chain to chain
  const ocTx = await ocToken.sendFrom(
    ocSigner.address,
    process.env.CHAIN_LZ_ID!,
    hre.ethers.zeroPadValue(signer.address, 32),
    process.env.AMOUNT!,
    [ocSigner.address, hre.ethers.utils., adapterParams],
    {value: process.env.ADDITIONAL_AMOUNT_FOR_GAS!}
  )
  console.log(`waiting for tx: ${ocTx.hash}`);
  await ocTx.wait();

  await _printBalances(signer, ocToken, ocSigner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
