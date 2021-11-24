// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');


  const PolygonAssetListingProposalGenericExecutor = await hre.ethers.getContractFactory(
    "PolygonAssetListingProposalGenericExecutor"
  );
  const polygonAssetListingProposalGenericExecutor = await PolygonAssetListingProposalGenericExecutor.deploy();
  await polygonAssetListingProposalGenericExecutor.deployed();
  console.log("Executor deployed to:", polygonAssetListingProposalGenericExecutor.address);

  await sleep(60000);
  await hre.run("verify:verify", {
    address: polygonAssetListingProposalGenericExecutor.address,
    constructorArguments: [],
  });
  
}

function sleep(ms) {
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
