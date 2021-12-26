// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

interface IProposalGenericExecutor {

  function execute(
    address aToken,
    address stableDebt,
    address variableDebt,
    uint8 decimals,
    address interestRateStrategy,
    address underlyingAsset,
    string calldata underlyingAssetName,
    bytes calldata params) external;
}