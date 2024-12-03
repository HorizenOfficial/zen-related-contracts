// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import hre from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const signer = (await hre.ethers.getSigners())[0];

  //deploy on gobi
  console.log("Deploying Chain Token (ZenNativeOFT)")
  const ZenNativeOFT = await hre.ethers.getContractFactory("ZenNativeOFT");
  const token = await ZenNativeOFT.deploy(
    process.env.CHAIN_TOKEN_NAME,
    process.env.CHAIN_TOKEN_SYMBOL,
    process.env.CHAIN_LZ_ENDPOINT,
    signer.address
  )
  await token.deployed();

  console.log(`Chain token address: ${token.address}`)

  //deploy on other chain
  const ocProvider = new hre.ethers.providers.JsonRpcProvider(process.env.OTHER_CHAIN_RPC!);
  const ocSigner = new hre.ethers.Wallet(process.env.OTHER_CHAIN_PRIVATE_KEY!, ocProvider);

  console.log("Deploying Other Chain Token (OtherSideOFT)")
  const OFT = await hre.ethers.getContractFactory("OtherSideOFT");
  const ocToken = await OFT.connect(ocSigner).deploy(
    process.env.OTHER_CHAIN_TOKEN_NAME!,
    process.env.OTHER_CHAIN_TOKEN_SYMBOL!,
    process.env.OTHER_CHAIN_LZ_ENDPOINT!,
    ocSigner.getAddress()
  )
  await ocToken.deployed();

  console.log(`Other Chain token address: ${ocToken.address}`)


  //config on chain
  console.log("Linking on chain token")
  let tx = await token.setPeer(process.env.OTHER_CHAIN_LZ_ID, hre.ethers.utils.hexZeroPad(ocToken.address, 32))

  console.log(`waiting for tx: ${tx.hash}`);
  await tx.wait();
  console.log("Other chain token set as remote on chain token.");

  //config on other chain
  console.log("linking on other chain token")
  let ocTx = await ocToken.connect(ocSigner).setPeer(process.env.CHAIN_LZ_ID, hre.ethers.utils.hexZeroPad(token.address, 32))

  console.log(`waiting for tx: ${ocTx.hash}`);
  await ocTx.wait();
  console.log("Chain token set as remote on other chain token.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
