import { expect } from "chai";
import { ethers } from "hardhat";
import { MyToken, TokenizedBallot, MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getProvider, getWalletAddress } from "../scripts/Helpers";

const MYTOKEN_CONTRACT_ADDRESS = "0x83D094e3A9980113153B5015d2FEF9C62725B901";
const TOKENIZEDBALLOT_CONTRACT_ADDRESS_1 = "0x670d2326f7dACD6cB67C97d3dA7121542b4ad386";
const TOKENIZEDBALLOT_CONTRACT_ADDRESS_2 = "0x81F2995A71922c2fF1284372912F44583307564C";
const TEST_BUY_VALUE = ethers.parseUnits("10"); // Trying to send 10 eth to buy tokens

async function deployContracts() {
  
  const provider = getProvider();
  const wallet = getWalletAddress(provider);

  // Attach MyToken and TokenizedBallot contracts:
  const myTokenFactory = new MyToken__factory(wallet);
  const myTokenContract = myTokenFactory.attach(
                            MYTOKEN_CONTRACT_ADDRESS
                          ) as MyToken;

  const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
  const tokenizedBallotContract_1 = tokenizedBallotFactory.attach(
                                      TOKENIZEDBALLOT_CONTRACT_ADDRESS_1 // Before voting power delegation
                                    ) as TokenizedBallot;
  
  const tokenizedBallotContract_2 = tokenizedBallotFactory.attach(
                                      TOKENIZEDBALLOT_CONTRACT_ADDRESS_2 // After voting power delegation
                                    ) as TokenizedBallot;

  // Give right to mint MyToken to the TokenizedBallotContracts:
  const MINTER_ROLE = await myTokenContract.MINTER_ROLE();
  myTokenContract.grantRole(MINTER_ROLE, tokenizedBallotContract_1.target);
  myTokenContract.grantRole(MINTER_ROLE, tokenizedBallotContract_2.target);

  // return everything:
  return { 
    myTokenContract,
    tokenizedBallotContract_1,
    tokenizedBallotContract_2
  };
}

// async function buyTokens() {
//   const { accounts, tokenSaleContract, myTokenContract, myNFTContract } =
//     await loadFixture(deployContracts);

//   // Get the balance of the account before the transaction:
//   const balanceBefore = await ethers.provider.getBalance(accounts[1].address);

//   const tx = await tokenSaleContract
//     .connect(accounts[1])
//     .buyTokens({ value: TEST_BUY_VALUE });
//   const txReceipt = await tx.wait();

//   // Get the gas costs of the transaction execution:
//   const gasUsed = txReceipt?.gasUsed ?? 0n;
//   const gasPrice = txReceipt?.gasPrice ?? 0n;
//   const gasCosts = gasUsed * gasPrice;

//   // Get the balance of the account after the transaction:
//   const balanceAfter = await ethers.provider.getBalance(accounts[1].address);

//   return {
//     accounts,
//     tokenSaleContract,
//     myTokenContract,
//     myNFTContract,
//     balanceBefore,
//     balanceAfter,
//     gasCosts
//   };
// }

// async function burnTokens() {
//   const { accounts, tokenSaleContract, myTokenContract, balanceAfter} = await loadFixture(buyTokens);
  
//   // In this case, we will return the whole 100 tokens:
//   const expectedTokenBalance = TEST_BUY_VALUE * TEST_RATIO;
//   // Our ethBalanceBefore will be the account balance inmmediately after having executed the buyTokens fixture:
// 	const ethBalanceBefore = balanceAfter;

//   // Allowing tokenSaleContract to burn the tokens on behalf of Acc1:
//   const allowTx = await myTokenContract
//     .connect(accounts[1])
//     .approve(tokenSaleContract.target, expectedTokenBalance);
//   const allowTxReceipt = await allowTx.wait();

//   // Getting the gas costs of the approve transaction call:
//   const allowTxGasUsed = allowTxReceipt?.gasUsed ?? 0n;
//   const allowTxPricePerGas = allowTxReceipt?.gasPrice ?? 0n;
//   const allowTxGasCosts = allowTxGasUsed * allowTxPricePerGas;

//   // Burning the tokens:
//   const burnTx = await tokenSaleContract
//     .connect(accounts[1])
//     .returnTokens(expectedTokenBalance);
//   const burnTxReceipt = await burnTx.wait();
  
//   // Getting the gas costs of the burn transaction call:
//   const burnTxGasUsed = burnTxReceipt?.gasUsed?? 0n;
//   const burnTxPricePerGas = burnTxReceipt?.gasPrice?? 0n;
//   const burnTxGasCosts = burnTxGasUsed * burnTxPricePerGas;

//   // The total gas cost of this fixture will be:
//   const gasCosts = allowTxGasCosts + burnTxGasCosts;
  
//   const ethBalanceAfter = await ethers.provider.getBalance(
//     accounts[1].address
//   ) ;

//   return {
//     accounts, 
//     tokenSaleContract, 
//     myTokenContract, 
//     ethBalanceBefore, 
//     gasCosts, 
//     ethBalanceAfter,
//   };
// }

describe("TokenizedBallot Voting", async () => {
  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      throw new Error("Not implemented");
    })
    it("gets winningProposal", async () => {
      const { tokenizedBallotContract_2 } = await loadFixture(deployContracts);
      const winningProposal = await tokenizedBallotContract_2.winningProposal();
      expect (winningProposal).to.eq(1);
    });
    it("uses a valid ERC20 as payment token", async () => {
      throw new Error("Not implemented");
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      throw new Error("Not implemented");
    });
  })
});

// describe("NFT Shop", async () => {

//   describe("When the Shop contract is deployed", async () => {
//     it("defines the ratio as provided in parameters", async () => {
//       const { tokenSaleContract } = await loadFixture(deployContracts);
//       const ratio = await tokenSaleContract.ratio();
//       expect (ratio).to.eq(TEST_RATIO);
//     })
//     it("defines the price as provided in parameters", async () => {
//       const { tokenSaleContract } = await loadFixture(deployContracts);
//       const price = await tokenSaleContract.price();
//       expect (price).to.eq(TEST_PRICE);
//     });
//     it("uses a valid ERC20 as payment token", async () => {
//       throw new Error("Not implemented");
//     });
//     it("uses a valid ERC721 as NFT collection", async () => {
//       throw new Error("Not implemented");
//     });
//   })
//   describe("When a user buys an ERC20 from the Token contract", async () => {  
//     it("charges the correct amount of ETH", async () => {
//       const { balanceBefore, balanceAfter, gasCosts } = await loadFixture(buyTokens);
//       const diff = balanceBefore - balanceAfter;
//       const expectedDiff = TEST_BUY_VALUE + gasCosts;
//       const error = diff - expectedDiff;
//       expect(error).to.eq(0);
//     })
//     it("gives the correct amount of tokens", async () => {
//       const { accounts, myTokenContract } = await loadFixture(buyTokens);
//       const balance = await myTokenContract.balanceOf(accounts[1].address);
//       expect(parseFloat(ethers.formatUnits(balance))).to.eq(100);
//     });
//   })
//   describe("When a user burns an ERC20 at the Shop contract", async () => {
//     it("gives the correct amount of ETH", async () => {
//       const { ethBalanceBefore, ethBalanceAfter, gasCosts } = await loadFixture(burnTokens);

//       // The returned ethers after burning the tokens should be:
//       const expectedReturn = TEST_BUY_VALUE - gasCosts;
      
//       // The actual returned ethers are:
//       const actualReturnedEth = ethBalanceAfter - ethBalanceBefore;
      
//       // They should be equal:
//       const error = actualReturnedEth - expectedReturn;
//       expect(error).to.eq(0);
//     })
//     it("burns the correct amount of tokens", async () => {
//       const { accounts, myTokenContract } = await loadFixture(burnTokens);
//       const balanceAfterBurn = await myTokenContract.balanceOf(accounts[1].address);
//       expect(balanceAfterBurn).to.eq(0);
//     });
//   })
//   describe("When a user buys an NFT from the Shop contract", async () => {
//     async function buyNFTs() {
//       const { accounts, tokenSaleContract, myTokenContract, myNFTContract } = await loadFixture(buyTokens);
//       const allowx = await myTokenContract
//         .connect (accounts[1])
//         .approve(tokenSaleContract.target, TEST_PRICE);
//       await allowx.wait();
      
//       const buyTx = await tokenSaleContract
//                             .connect(accounts[1])
//                             .buyNFT(0);
//       await buyTx.wait();
//       return { 
//         accounts, 
//         tokenSaleContract, 
//         myTokenContract,
//         myNFTContract,
//       };
//     }
//     it("charges the correct amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     })
//     it("gives the correct NFT", async () => {
//       const { accounts, myNFTContract } = await loadFixture(buyNFTs);
//       const nftOwner = await myNFTContract.ownerOf(0);
//       expect(nftOwner).to.eq(accounts[1].address);
//     });
//   })
//   describe("When a user burns their NFT at the Shop contract", async () => {
//     it("gives the correct amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     });
//   })
//   describe("When the owner withdraws from the Shop contract", async () => {
//     it("recovers the right amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     })
//     it("updates the owner pool account correctly", async () => {
//       throw new Error("Not implemented");
//     });
//   });
// });