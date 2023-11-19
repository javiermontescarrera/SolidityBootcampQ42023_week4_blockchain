import { ethers } from "ethers";
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import { getProvider, getWallet } from "./Helpers";

async function main() {
  
  //receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0];
  
  console.log(
    `Contract address: ${contractAddress}`
  );

  const provider = getProvider();

  //configuring the wallet - metamask wallet
  const wallet = getWallet(provider);
  const accountAddress = wallet.address;

  // const balanceBN = await provider.getBalance(wallet.address);
  // const balance = Number(ethers.formatUnits(balanceBN));
  // console.log(`Wallet balance ${balance} ETH`);
  // if (balance < 0.01) {
  //   throw new Error("Not enough ether");
  // }
  
  //attaching the smart contract using Typechain
  const ballotFactory = new TokenizedBallot__factory(wallet);
  const ballotContract = ballotFactory.attach(
    contractAddress
  ) as TokenizedBallot;
  const name:string[] = await ballotContract.getProposals(); 
  
  let index = 0;
  name.forEach(prop => {
    console.log(
      `Proposal ${index}: ${ethers.decodeBytes32String(prop)}\n`
    );
    index++;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
