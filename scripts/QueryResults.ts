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

  if (params.length != 1) throw new Error(`Expected 1 argument for contract address but received ${params.length} arguments.`);
  
  const contractAddress = params[0];

  console.log("Attaching to the deployed contract");
  let ballotContract: Ballot;

  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = await ballotContractFactory.attach(contractAddress);
  const winnerName = await ballotContract.winnerName();
  console.log(`The winning proposal is ${ ethers.utils.parseBytes32String(winnerName) }`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});