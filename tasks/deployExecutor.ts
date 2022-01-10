import { task } from "hardhat/config";

task("deployExecutor", "deploy executor").setAction(async (_, hre) => {
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
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
