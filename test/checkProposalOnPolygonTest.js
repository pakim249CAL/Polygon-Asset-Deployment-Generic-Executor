const hre = require("hardhat");
const ethers = require("ethers");
const { expect } = require("chai");
const {
  expectEvent,
  expectRevert,
  time,
} = require("@openzeppelin/test-helpers");
const fs = require('fs')

describe("Check Proposal", function() {
  const spoofAddress = '0x0000000000000000000000000000000000001001';
  const polygonBridgeExecutorAddress = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772';

  let spoof;
  let fxChild;
  let fxData;
  let lendingPool;

  before(async function() {

    //Spoofing special address to simulate sending data through bridge
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [spoofAddress], 
    });
    await network.provider.send("hardhat_setBalance", [
      spoofAddress,
      '0x8AC7230489E80000',
    ]);
    spoof = await hre.ethers.getSigner(spoofAddress);

    const FxChild = await hre.ethers.getContractFactory(
      "FxChild"
    );    
    const PolygonBridgeExecutor = await hre.ethers.getContractFactory(
      "PolygonBridgeExecutor"
    );

    fxChild = await FxChild.attach("0x8397259c983751DAf40400790063935a11afa28a");
    polygonBridgeExecutor = await PolygonBridgeExecutor.attach(polygonBridgeExecutorAddress);
    lendingPool = await hre.ethers.getContractAt("ILendingPool", "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf");
    fxData = fs.readFileSync("Output.txt", 'utf8');

    //Just doing the work of decoding to help diagnose issues
    const decodedFx = ethers.utils.defaultAbiCoder.decode(['address', 'address', 'bytes'], fxData);
    const decodedExecutor = ethers.utils.defaultAbiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]'], decodedFx[2]);
    console.log(decodedExecutor);
  });

  it("proposal payload should update the aave market", async function() {
    // Broken. Trying to figure out why reserves aren't being updated even though the transaction is successful.
    // The number is stateId from fxRoot and doesn't matter. It's not actually used anywhere.
    console.log(await lendingPool.getConfiguration("0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"));
    sendStatetx = await fxChild.connect(spoof).onStateReceive(ethers.BigNumber.from(1259388), ethers.utils.hexlify(fxData));
    await hre.network.provider.send('evm_increaseTime', [172801]);
    console.log("State receive successful");
    executeTx = await polygonBridgeExecutor.execute(await polygonBridgeExecutor.getActionsSetCount() - 1);
    console.log(await lendingPool.getReserveData("0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7"));
    console.log(await lendingPool.getReserveData("0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3"));
    console.log(await lendingPool.getReserveData("0x85955046df4668e1dd369d2de9f3aeb98dd2a369"));
    console.log(await lendingPool.getReserveData("0x172370d5cd63279efa6d502dab29171933a610af"));
    console.log(await lendingPool.getReserveData("0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a"));
    console.log(await lendingPool.getConfiguration("0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"));
    console.log(await lendingPool.getConfiguration("0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"));
  });
});