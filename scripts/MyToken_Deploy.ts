import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
import { getProvider, getWallet } from "./Helpers";
dotenv.config();

async function main() {
  // Inspecting data from public blockchains using RPC connections (configuring the provider)
  const provider = getProvider();
  const lastBlock = await provider.getBlock("latest");
  console.log(`Last block number: ${lastBlock?.number}`);
  const lastBlockTimestamp = lastBlock?.timestamp ?? 0;
  const lastBlockDate = new Date(lastBlockTimestamp * 1000);
  console.log(
    `Last block timestamp: ${lastBlockTimestamp} (${lastBlockDate.toLocaleDateString()} ${lastBlockDate.toLocaleTimeString()})`
  );

  // Configuring the wallet
  const wallet = getWallet(provider);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  //deploying the smart contract using Typechain
  const myTokenFactory = new MyToken__factory(wallet);
  const myTokenContract = await myTokenFactory.deploy();
  await myTokenContract.waitForDeployment();
  console.log(`MyToken contract deployed to ${myTokenContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});