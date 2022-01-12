const erc20Abi = require("../../abis/ERC20Abi.json");
const aTokenAbi = require("../../abis/ATokenAbi.json");

import { expect } from "chai";
import { Contract } from "ethers";
import { parseUnits } from "ethers/lib/utils";

import { DRE } from "../../helpers/misc-utils";
import { MAX_UINT_AMOUNT } from "../../helpers/constants";

export const spendList = {
  GHST: {
    holder: "0xffffffffffffffffffffffffffffffffffffffff",
    transfer: "1000",
    deposit: "100",
    decimals: "18",
  },
  BAL: {
    holder: "0x415017fbc4bbdaf462b0ed72193babe317fbf9f6",
    transfer: "1000",
    deposit: "100",
    decimals: "18",
  },
  DPI: {
    holder: "0x1B70496E3E550Ff8aD4A6984656aeaceaD861e52",
    transfer: "100",
    deposit: "10",
    decimals: "18",
  },
  CRV: {
    holder: "0x06959153b974d0d5fdfd87d561db6d8d4fa0bb0b",
    transfer: "1000",
    deposit: "100",
    decimals: "18",
  },
  SUSHI: {
    holder: "0xdd11d5db35f52110d6c6a03778e2f822b1f79a0e",
    transfer: "1000",
    deposit: "100",
    decimals: "18",
  },
  LINK: {
    holder: "0xf919E7804dC4c413f5c3F523F293B60E4dc8ED7C",
    transfer: "1000",
    deposit: "100",
    decimals: "18",
  },
  WMATIC: {
    holder: "0x793b32906abdaca305e68b3ef5dae62b720e8f8a",
    transfer: "1000",
    deposit: "100",
    decimals: "18",
  },
};

export const fullCycleTest = async (
  symbol: string,
  tokenAddress: string,
  pool: Contract,
  borrow: Boolean
) => {
  const proposerSigner = (await DRE.ethers.getSigners())[0];
  const proposerAddress = await proposerSigner.getAddress();

  const { aTokenAddress } = await pool.getReserveData(tokenAddress);
  const reserve = new Contract(tokenAddress, erc20Abi, proposerSigner);
  const aToken = new Contract(aTokenAddress, aTokenAbi, proposerSigner);

  const reserveSymbol = await reserve.symbol();
  expect(reserveSymbol).to.be.equal(symbol);

  await DRE.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [spendList[symbol].holder],
  });
  const holderSigner = await DRE.ethers.getSigner(spendList[symbol].holder);

  // Transfer assets to proposer from reserve holder
  await (
    await reserve
      .connect(holderSigner)
      .transfer(proposerAddress, parseUnits(spendList[symbol].transfer, spendList[symbol].decimals))
  ).wait();

  // Amounts
  const depositAmount = parseUnits(spendList[symbol].deposit, spendList[symbol].decimals);
  const borrowAmount = depositAmount.div("10");

  // Deposit to LendingPool
  await (await reserve.connect(proposerSigner).approve(pool.address, depositAmount)).wait();
  const tx1 = await pool
    .connect(proposerSigner)
    .deposit(reserve.address, depositAmount, proposerAddress, 0);
  await tx1.wait();
  expect(tx1).to.emit(pool, "Deposit");

  if (borrow) {
    // Request loan to LendingPool
    const tx2 = await pool.borrow(reserve.address, borrowAmount, "2", "0", proposerAddress);
    await tx2.wait();
    expect(tx2).to.emit(pool, "Borrow");

    // Repay variable loan to LendingPool
    await (await reserve.connect(proposerSigner).approve(pool.address, MAX_UINT_AMOUNT)).wait();
    const tx3 = await pool.repay(reserve.address, MAX_UINT_AMOUNT, "2", proposerAddress);
    await tx3.wait();
    expect(tx3).to.emit(pool, "Repay");
  }

  // Withdraw from LendingPool
  const priorBalance = await reserve.balanceOf(proposerAddress);
  await (await aToken.connect(proposerSigner).approve(pool.address, MAX_UINT_AMOUNT)).wait();
  const tx4 = await pool.withdraw(reserve.address, MAX_UINT_AMOUNT, proposerAddress);
  await tx4.wait();
  expect(tx4).to.emit(pool, "Withdraw");

  const afterBalance = await reserve.balanceOf(proposerAddress);
  expect(await aToken.balanceOf(proposerAddress)).to.be.eq("0");
  expect(afterBalance).to.be.gt(priorBalance);
};
