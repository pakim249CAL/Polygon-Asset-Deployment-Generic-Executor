import * as hre from "hardhat";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

import { 
  polygonBridgeExecutorAddress,
  oracleAddress,
} from "../helpers/types";
import {
  fillPolygonProposalActions
} from "../helpers/helpers";

describe("Proposal Check", function() {
  const spoofAddress = '0x0000000000000000000000000000000000001001';
  const multisigAddress = '0xBb2F3BA4a63982eD6D93c190c28B15CBBA0B6AF3';

  let spoof: Signer;
  let multisig: Signer;
  let fxChild: Contract;
  let lendingPool: Contract;
  let aaveOracle: Contract;
  let polygonBridgeExecutor: Contract;
  let proposalActions = fillPolygonProposalActions();

  before(async function() {

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
      '0x8AC7230489E80000',
    ]);
    await hre.network.provider.send("hardhat_setBalance", [
      multisigAddress,
      '0x8AC7230489E80000',
    ]);
    spoof = await hre.ethers.getSigner(spoofAddress);
    multisig = await hre.ethers.getSigner(multisigAddress);

    const FxChild = await hre.ethers.getContractFactory(
      "FxChild"
    );    
    const PolygonBridgeExecutor = await hre.ethers.getContractFactory(
      "PolygonBridgeExecutor"
    );
    aaveOracle = await hre.ethers.getContractAt("IOwnable", oracleAddress);
    // At time of testing, ownership of oracle to the bridge has not been done.
    await aaveOracle.connect(multisig).transferOwnership(polygonBridgeExecutorAddress);
    expect(await aaveOracle.owner()).to.equal(polygonBridgeExecutorAddress);

    fxChild = await FxChild.attach("0x8397259c983751DAf40400790063935a11afa28a");
    polygonBridgeExecutor = await PolygonBridgeExecutor.attach(polygonBridgeExecutorAddress);
    lendingPool = await hre.ethers.getContractAt("ILendingPool", "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf");
  });

  it("proposal payload should update the aave market", async function() {
    console.log(proposalActions.decodedExecutorData)
    let sendStatetx = await fxChild.connect(spoof).onStateReceive(
      ethers.BigNumber.from(1259388), 
      ethers.utils.hexlify(proposalActions.stateSenderData));
    await hre.network.provider.send('evm_increaseTime', [172801]);
    console.log("State receive successful");
    await polygonBridgeExecutor.execute(
      await polygonBridgeExecutor.getActionsSetCount() - 1
    );
    console.log(await lendingPool.getReserveData("0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7"));
    console.log(await lendingPool.getReserveData("0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3"));
    console.log(await lendingPool.getReserveData("0x85955046df4668e1dd369d2de9f3aeb98dd2a369"));
    console.log(await lendingPool.getReserveData("0x172370d5cd63279efa6d502dab29171933a610af"));
    console.log(await lendingPool.getReserveData("0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a"));
    console.log(await lendingPool.getConfiguration("0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"));
    console.log(await lendingPool.getConfiguration("0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"));
  });
});