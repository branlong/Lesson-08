import { ethers } from "hardhat";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const provider = await ethers.getDefaultProvider("goerli");
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  //const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");

  const signer = wallet.connect(provider);

  const args = process.argv;
  const params = args.slice(2);

  if (params.length != 2) throw new Error(`Expected 2 arguments for contract address and target account but received ${params.length} argument(s).`);
  
  const contractAddress = params[0];
  const targetAccount = params[1];

  console.log("Attaching to the deployed contract");
  let ballotContract: Ballot;

  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = await ballotContractFactory.attach(contractAddress);
  const tx = await ballotContract.giveRightToVote(targetAccount);
  const receipt = await tx.wait();
  console.log({ receipt });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});