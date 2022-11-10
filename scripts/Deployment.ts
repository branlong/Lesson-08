import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const provider = await ethers.getDefaultProvider("goerli");

  //const lastBlock = await provider.getBlock("latest");
  //console.log(lastBlock);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  //const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");

  const signer = wallet.connect(provider);
  var balanceBN = await signer.getBalance();

  console.log(`Connected to the account of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);

  const args = process.argv;
  const proposals = args.slice(2);

  if (proposals.length <= 0) throw new Error("Not enough arguments");

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => console.log(`Proposal #${index + 1}: ${element}`));
  let ballotContract: Ballot;

  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = await ballotContractFactory.deploy(proposals.map(proposal => ethers.utils.formatBytes32String(proposal)));
  await ballotContract.deployed();

  console.log(`The contract has deployed at the address ${ballotContract.address}`);

  const chairperson = await ballotContract.chairperson();
  console.log(`The chairperson for this ballot is ${chairperson}`);

  // Note: I have deployed this contract to 0x5c452db7139a8af700e7fdbcf1d1c05a14be41ed with the proposals: Raspberry, Lemon, Watermelon
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});