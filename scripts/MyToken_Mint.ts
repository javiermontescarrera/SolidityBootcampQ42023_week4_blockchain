import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import { getProvider, getWallet } from "./Helpers";

async function main() {
  
  console.log('Starting mint...');

  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0];
  const addressTo = parameters[1];
  const amount = ethers.parseUnits(parameters[2], "ether");
  
  console.log(
    `Contract address: ${contractAddress}\n`,
    `Address to send the tokens: ${addressTo}\n`,
    `Amount of tokens: ${amount}\n`,
  );

  const provider = getProvider();

  // Configuring the wallet
  const wallet = getWallet(provider);
  const accountAddress = wallet.address;

  // Attaching the smart contract using Typechain
  const myTokenFactory = new MyToken__factory(wallet);
  const myTokenContract = myTokenFactory.attach(
    contractAddress
  ) as MyToken;

  const initialBalance = await myTokenContract.balanceOf(addressTo);
  console.log(
    `The initial balance of the account ${addressTo} is: ${initialBalance}\n`
  );

  // Minting MyToken
  const mintTx = await myTokenContract.mint(addressTo, amount);
  await mintTx.wait();
  
  const finalBalance = await myTokenContract.balanceOf(addressTo); 
  console.log(
    'Mint process concluded.\n', 
    `The final balance of the account ${addressTo} is: ${finalBalance}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
