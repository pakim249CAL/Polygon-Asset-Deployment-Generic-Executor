// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as hre from "hardhat";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');


  const ProposalDataProvider = await hre.ethers.getContractFactory(
    "ProposalDataProvider"
  );
  const proposalDataProvider = await ProposalDataProvider.deploy();
  await proposalDataProvider.deployed();
  console.log("Data Provider deployed to:", proposalDataProvider.address);

  await sleep(60000);
  await hre.run("verify:verify", {
    address: proposalDataProvider.address,
    constructorArguments: [],
  });
  
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
