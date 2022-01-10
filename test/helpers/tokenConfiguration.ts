const aTokenAbi = require("../../abis/ATokenAbi.json");
const variableDebtTokenAbi = require("../../abis/VariableDebtTokenAbi.json");
const stableDebtTokenAbi = require("../../abis/StableDebtTokenAbi.json");

import { Contract } from "ethers";
import { expect } from "chai";

import { DRE } from "../../helpers/misc-utils";
import { ProposalParams } from "../../helpers/types";

import {
  polygonLendingPoolAddress,
  treasuryAddress,
  incentivesControllerAddress,
  ATOKEN_NAME_PREFIX,
  ATOKEN_SYMBOL_PREFIX,
  VAR_DEBT_NAME_PREFIX,
  VAR_DEBT_SYMBOL_PREFIX,
  STABLE_DEBT_NAME_PREFIX,
  STABLE_DEBT_SYMBOL_PREFIX,
} from "../../helpers/constants";

export const checkATokenConfiguration = async (
  proposalParams: ProposalParams,
  aTokenAddress: string
) => {
  const { ethers } = DRE;
  const aToken = new Contract(aTokenAddress, aTokenAbi, ethers.provider);
  expect(await aToken.name()).to.equal(ATOKEN_NAME_PREFIX.concat(proposalParams.name));
  expect(await aToken.symbol()).to.equal(ATOKEN_SYMBOL_PREFIX.concat(proposalParams.name));
  expect(await aToken.decimals()).to.equal(18);

  expect(await aToken.POOL()).to.equal(ethers.utils.getAddress(polygonLendingPoolAddress));
  expect(await aToken.RESERVE_TREASURY_ADDRESS()).to.equal(ethers.utils.getAddress(treasuryAddress));
  expect(await aToken.UNDERLYING_ASSET_ADDRESS()).to.equal(
    ethers.utils.getAddress(proposalParams.underlying)
  );
  expect(await aToken.getIncentivesController()).to.equal(
    ethers.utils.getAddress(incentivesControllerAddress)
  );

  // potentially check domain seperator
};

export const checkVariableDebtTokenConfiguration = async (
  proposalParams: ProposalParams,
  variableDebtTokenAddress: string
) => {
  const { ethers } = DRE;
  const aToken = new Contract(variableDebtTokenAddress, variableDebtTokenAbi, ethers.provider);
  expect(await aToken.name()).to.equal(VAR_DEBT_NAME_PREFIX.concat(proposalParams.name));
  expect(await aToken.symbol()).to.equal(VAR_DEBT_SYMBOL_PREFIX.concat(proposalParams.name));
  expect(await aToken.decimals()).to.equal(18);

  expect(await aToken.POOL()).to.equal(ethers.utils.getAddress(polygonLendingPoolAddress));
  expect(await aToken.UNDERLYING_ASSET_ADDRESS()).to.equal(
    ethers.utils.getAddress(proposalParams.underlying)
  );
  expect(await aToken.getIncentivesController()).to.equal(
    ethers.utils.getAddress(incentivesControllerAddress)
  );
};

export const checkStableDebtTokenConfiguration = async (
  proposalParams: ProposalParams,
  stableDebtTokenAddress: string
) => {
  const { ethers } = DRE;
  const aToken = new Contract(stableDebtTokenAddress, stableDebtTokenAbi, ethers.provider);
  expect(await aToken.name()).to.equal(STABLE_DEBT_NAME_PREFIX.concat(proposalParams.name));
  expect(await aToken.symbol()).to.equal(STABLE_DEBT_SYMBOL_PREFIX.concat(proposalParams.name));
  expect(await aToken.decimals()).to.equal(18);

  expect(await aToken.POOL()).to.equal(ethers.utils.getAddress(polygonLendingPoolAddress));
  expect(await aToken.UNDERLYING_ASSET_ADDRESS()).to.equal(
    ethers.utils.getAddress(proposalParams.underlying)
  );
  expect(await aToken.getIncentivesController()).to.equal(
    ethers.utils.getAddress(incentivesControllerAddress)
  );
};
