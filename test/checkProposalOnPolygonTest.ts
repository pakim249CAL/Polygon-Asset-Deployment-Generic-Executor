import * as hre from "hardhat";
import * as fs from "fs";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";
import { expect } from "chai";

import {
  fxChildAddress,
  polygonBridgeExecutorAddress,
  oracleAddress,
  ghstParams,
  balParams,
  dpiParams,
  crvParams,
  sushiParams,
  linkParams,
  maticParams,
} from "../helpers/types";

import { fillPolygonProposalActionsDelegateCall } from "../helpers/helpers";

describe("Proposal Check", function () {
  const spoofAddress = "0x0000000000000000000000000000000000001001";
  const multisigAddress = "0xBb2F3BA4a63982eD6D93c190c28B15CBBA0B6AF3";

  let spoof: Signer;
  let multisig: Signer;
  let fxChild: Contract;
  let lendingPool: Contract;
  let aaveOracle: Contract;
  let dataProvider: Contract;
  let proposalParams = [
    ghstParams,
    balParams,
    dpiParams,
    crvParams,
    sushiParams,
    linkParams,
    maticParams,
  ];
  let polygonBridgeExecutor: Contract;
  let polygonDelegateCallExecutor: Contract;
  let proposalActions: any;

  before(async function () {
    //Spoofing special address to simulate sending data through bridge
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [spoofAddress],
    });
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [multisigAddress],
    });
    await hre.network.provider.send("hardhat_setBalance", [spoofAddress, "0x8AC7230489E80000"]);
    await hre.network.provider.send("hardhat_setBalance", [multisigAddress, "0x8AC7230489E80000"]);
    spoof = await hre.ethers.getSigner(spoofAddress);
    multisig = await hre.ethers.getSigner(multisigAddress);

    const FxChild = await hre.ethers.getContractFactory("FxChild");
    const PolygonBridgeExecutor = await hre.ethers.getContractFactory("PolygonBridgeExecutor");

    fxChild = await FxChild.attach(fxChildAddress);
    polygonBridgeExecutor = await PolygonBridgeExecutor.attach(polygonBridgeExecutorAddress);

    lendingPool = await hre.ethers.getContractAt(
      "ILendingPool",
      "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf"
    );
    dataProvider = await hre.ethers.getContractAt(
      "IAaveProtocolDataProvider",
      "0x7551b5D2763519d4e37e8B81929D336De671d46d"
    );
  });

  it("transfer ownership of aave oracle - (to be removed)", async () => {
    aaveOracle = await hre.ethers.getContractAt("IAaveOracle", oracleAddress);
    await aaveOracle.connect(multisig).transferOwnership(polygonBridgeExecutorAddress);
    expect(await aaveOracle.owner()).to.equal(polygonBridgeExecutorAddress);
  });

  it("spoof cross-chain transaction", async () => {
    let crossChainData;
    if (process.env.END_TO_END == "TRUE") {
      console.log("\tUsing txt file for cross-chain data");
      crossChainData = fs.readFileSync("./FxData.txt").toString();
    } else {
      console.log("\tDeploying executor");
      const PolygonDelegateCallExecutor = await hre.ethers.getContractFactory(
        "PolygonAssetDeploymentGenericExecutor"
      );
      polygonDelegateCallExecutor = await PolygonDelegateCallExecutor.deploy();
      proposalActions = fillPolygonProposalActionsDelegateCall(polygonDelegateCallExecutor.address);
      crossChainData = ethers.utils.hexlify(proposalActions.stateSenderData);
    }

    const tx = await fxChild
      .connect(spoof)
      .onStateReceive(ethers.BigNumber.from(1259388), crossChainData);

    const txReceipt = await tx.wait();
    const actionsSetQueuedEvent = await polygonBridgeExecutor.interface.parseLog(txReceipt.logs[1]);
    expect(actionsSetQueuedEvent.name).to.equal("ActionsSetQueued");
  });

  it("proposal payload should update the aave market and oracles", async function () {
    await hre.network.provider.send("evm_increaseTime", [172801]);
    console.log("\tExecuting Polygon ActionsSet...");
    await polygonBridgeExecutor.execute((await polygonBridgeExecutor.getActionsSetCount()) - 1);
    console.log("\tPolygon ActionsSet Executed\n");
    console.log("\tChecking State...");
    for (let i = 0; i < proposalParams.length; i++) {
      const reserveConfig = await dataProvider.getReserveConfigurationData(
        proposalParams[i].underlying
      );
      //Check if reserves are initiated with tokens and market is active
      const reserveData = await lendingPool.getReserveData(proposalParams[i].underlying);
      if (proposalParams[i].initReserve) {
        expect(reserveData.interestRateStrategyAddress).to.equal(
          proposalParams[i].interestRateStrategy
        );
        expect(reserveConfig.isActive).to.equal(true);
      }
      //Check if borrow is enabled and disabled correctly
      if (proposalParams[i].borrow || proposalParams[i].name == "WMATIC") {
        expect(reserveConfig.borrowingEnabled).to.equal(true);
      } else {
        expect(reserveConfig.borrowingEnabled).to.equal(false);
      }
      //Check if reserve factor is updated
      if (proposalParams[i].updateReserveFactor) {
        expect(reserveConfig.reserveFactor).to.equal(proposalParams[i].reserveFactor);
      }
      //Check if reserve configurations are updated
      if (proposalParams[i].updateReserveConfiguration) {
        expect(reserveConfig.ltv).to.equal(proposalParams[i].ltv);
        expect(reserveConfig.liquidationThreshold).to.equal(proposalParams[i].lt);
        expect(reserveConfig.liquidationBonus).to.equal(proposalParams[i].lb);
      }
      //Check if oracles have been changed correctly
      if (proposalParams[i].updateOracle) {
        expect(await aaveOracle.getSourceOfAsset(proposalParams[i].underlying)).to.equal(
          proposalParams[i].oracleSource
        );
      }
      console.log(`\t\t${proposalParams[i].name} configured correctly`);
    }
  });
});
