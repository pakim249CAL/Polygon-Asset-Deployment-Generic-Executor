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

    fxChild = await FxChild.attach("0x8397259c983751DAf40400790063935a11afa28a");
    lendingPool = await hre.ethers.getContractAt("ILendingPool", "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf");
    fxData = fs.readFileSync("Output.txt", 'utf8');

    //Just doing the work of decoding to help diagnose issues
    const decodedFx = ethers.utils.defaultAbiCoder.decode(['address', 'address', 'bytes'], fxData);
    const decodedExecutor = ethers.utils.defaultAbiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]'], decodedFx[2]);
    const test = ethers.utils.defaultAbiCoder.decode(['address', 'address', 'address', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint8', 'bool', 'bool', 'bool'], decodedExecutor[3][0]);
    console.log(test);
  });

  it("proposal payload should update the aave market", async function() {
    await fxChild.connect(spoof).onStateReceive(ethers.BigNumber.from(1259388), ethers.utils.hexlify(fxData));
    console.log(await lendingPool.getReserveData('0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7'));
  });
});