// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const OPTIONS = "0x0003010011010000000000000000000000000000ea60";

async function _printBalances(signer: any, ocToken: any, ocSigner: any) {
  console.log("retrieving balances");

  let nativeBalance = await signer.provider.getBalance(signer.address);
  console.log("native balance on chain:", nativeBalance.toString());

  let ocBalance = await ocToken.connect(ocSigner).balanceOf(ocSigner.address);
  console.log("token balance on other chain:", ocBalance.toString());

}

async function main() {
  const signer = (await hre.ethers.getSigners())[0];
  const ocProvider = new hre.ethers.providers.JsonRpcProvider(process.env.OTHER_CHAIN_RPC!);
  const ocSigner = new hre.ethers.Wallet(process.env.OTHER_CHAIN_PRIVATE_KEY!, ocProvider);

  const token = await hre.ethers.getContractAt("OFT", process.env.CHAIN_TOKEN_ADDRESS!);
  const ocToken = (await hre.ethers.getContractAt("OFT", process.env.OTHER_CHAIN_TOKEN_ADDRESS!)).connect(ocSigner);

  await _printBalances(signer, ocToken, ocSigner);

  //from other chain to chain
  const ocSendParam = [
    process.env.CHAIN_LZ_ID,
    hre.ethers.utils.hexZeroPad(signer.address, 32),
    Number(process.env.AMOUNT),
    Number(process.env.AMOUNT),
    OPTIONS,
    [],
    []
  ]
  const ocQuote = await ocToken.quoteSend(ocSendParam, false);
  console.log(`quote returned ${JSON.stringify(ocQuote)}`);

  const ocTx = await ocToken.send(
    ocSendParam,
    ocQuote,
    ocSigner.address,
    {value: ocQuote.nativeFee}
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
