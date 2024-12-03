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
  
  //from chain to other chain, with value since is native
  const sendParam = [
    process.env.OTHER_CHAIN_LZ_ID,
    hre.ethers.utils.hexZeroPad(ocSigner.address, 32),
    Number(process.env.AMOUNT),
    Number(process.env.AMOUNT) * 0.9, //up to 10% slippage
    OPTIONS,
    [],
    []
  ]
  console.log(`transfer amount: ${Number(process.env.AMOUNT)}`)
  const quote = await token.quoteSend(sendParam, false);
  console.log(`quote returned ${JSON.stringify(quote)}`);

  const tx = await token.send(
    sendParam,
    quote,
    signer.address,
    {value: quote.nativeFee.add(Number(process.env.AMOUNT))}
  )
  console.log(`waiting for tx: ${tx.hash}`);
  await tx.wait();

  await _printBalances(signer, ocToken, ocSigner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
