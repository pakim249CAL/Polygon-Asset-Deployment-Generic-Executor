import * as hre from "hardhat";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

async function main() {
  const PolygonAssetDeploymentGenericExecutor = await hre.ethers.getContractFactory(
    "PolygonAssetDeploymentGenericExecutor"
  );
  const polygonAssetDeploymentGenericExecutor = await PolygonAssetDeploymentGenericExecutor.deploy();
  await polygonAssetDeploymentGenericExecutor.deployed();
  console.log("Executor Provider deployed to:", polygonAssetDeploymentGenericExecutor.address);

  await sleep(60000);
  await hre.run("verify:verify", {
    address: polygonAssetDeploymentGenericExecutor.address,
    constructorArguments: [],
  });
  
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
