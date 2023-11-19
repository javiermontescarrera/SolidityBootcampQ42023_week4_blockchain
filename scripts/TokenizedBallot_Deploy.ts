import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { TokenizedBallot__factory } from "../typechain-types";
import { getProvider, getWallet } from "./Helpers";
dotenv.config();

async function main() {
  //receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Proposals not provided");
  const myTokenContractAddress = parameters[0];

  const proposals = process.argv.slice(3);
  console.log("Deploying Ballot contract");
  console.log(`MyToken contract address: ${myTokenContractAddress}`);
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  //inspecting data from public blockchains using RPC connections (configuring the provider)
  const provider = getProvider();
  const lastBlock = await provider.getBlock("latest");
  const lastBlockNumber = lastBlock?.number;
  console.log(`Last block number: ${lastBlockNumber}`);
  const lastBlockTimestamp = lastBlock?.timestamp ?? 0;
  const lastBlockDate = new Date(lastBlockTimestamp * 1000);
  console.log(
    `Last block timestamp: ${lastBlockTimestamp} (${lastBlockDate.toLocaleDateString()} ${lastBlockDate.toLocaleTimeString()})`
  );

  //configuring the wallet 
  const wallet = getWallet(provider);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  //deploying the smart contract using Typechain
  const ballotFactory = new TokenizedBallot__factory(wallet);
  const ballotContract = await ballotFactory.deploy(
    proposals.map(ethers.encodeBytes32String),
    myTokenContractAddress,
    lastBlockNumber
  );
  await ballotContract.waitForDeployment();
  console.log(`Contract deployed to ${ballotContract.target}`);
  for (let index = 0; index < proposals.length; index++) {
    const proposal = await ballotContract.proposals(index);
    const name = ethers.decodeBytes32String(proposal.name);
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});