import * as hre from "hardhat";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

import {
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
import {
  fillPolygonProposalActionsDelegateCall,
  fillPolygonProposalActions,
} from "../helpers/helpers";

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
    await hre.network.provider.send("hardhat_setBalance", [
      spoofAddress,
      "0x8AC7230489E80000",
    ]);
    await hre.network.provider.send("hardhat_setBalance", [
      multisigAddress,
      "0x8AC7230489E80000",
    ]);
    spoof = await hre.ethers.getSigner(spoofAddress);
    multisig = await hre.ethers.getSigner(multisigAddress);

    const FxChild = await hre.ethers.getContractFactory("FxChild");
    const PolygonBridgeExecutor = await hre.ethers.getContractFactory(
      "PolygonBridgeExecutor"
    );
    const PolygonDelegateCallExecutor = await hre.ethers.getContractFactory(
      "PolygonAssetDeploymentGenericExecutor"
    );
    polygonDelegateCallExecutor = await PolygonDelegateCallExecutor.deploy();
    proposalActions = fillPolygonProposalActionsDelegateCall(
      polygonDelegateCallExecutor.address
    );
    aaveOracle = await hre.ethers.getContractAt("IAaveOracle", oracleAddress);
    // At time of testing, ownership of oracle to the bridge has not been done.
    await aaveOracle
      .connect(multisig)
      .transferOwnership(polygonBridgeExecutorAddress);

    fxChild = await FxChild.attach(
      "0x8397259c983751DAf40400790063935a11afa28a"
    );
    polygonBridgeExecutor = await PolygonBridgeExecutor.attach(
      polygonBridgeExecutorAddress
    );
    lendingPool = await hre.ethers.getContractAt(
      "ILendingPool",
      "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf"
    );
    dataProvider = await hre.ethers.getContractAt(
      "IAaveProtocolDataProvider",
      "0x7551b5D2763519d4e37e8B81929D336De671d46d"
    );
  });

  it("proposal payload should update the aave market and oracles", async function () {
    expect(await aaveOracle.owner()).to.equal(polygonBridgeExecutorAddress);
    let sendStatetx = await fxChild
      .connect(spoof)
      .onStateReceive(
        ethers.BigNumber.from(1259388),
        ethers.utils.hexlify(proposalActions.stateSenderData)
      );
    await hre.network.provider.send("evm_increaseTime", [172801]);
    console.log("State receive successful");
    await polygonBridgeExecutor.execute(
      (await polygonBridgeExecutor.getActionsSetCount()) - 1
    );
    for (let i = 0; i < proposalParams.length; i++) {
      const reserveConfig = await dataProvider.getReserveConfigurationData(
        proposalParams[i].underlying
      );
      //Check if reserves are initiated with tokens and market is active
      const reserveData = await lendingPool.getReserveData(
        proposalParams[i].underlying
      );
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
        expect(reserveConfig.reserveFactor).to.equal(
          proposalParams[i].reserveFactor
        );
      }
      //Check if reserve configurations are updated
      if (proposalParams[i].updateReserveConfiguration) {
        expect(reserveConfig.ltv).to.equal(proposalParams[i].ltv);
        expect(reserveConfig.liquidationThreshold).to.equal(
          proposalParams[i].lt
        );
        expect(reserveConfig.liquidationBonus).to.equal(proposalParams[i].lb);
      }
      //Check if oracles have been changed correctly
      if (proposalParams[i].updateOracle) {
        expect(
          await aaveOracle.getSourceOfAsset(proposalParams[i].underlying)
        ).to.equal(proposalParams[i].oracleSource);
      }
    }
  });
});
