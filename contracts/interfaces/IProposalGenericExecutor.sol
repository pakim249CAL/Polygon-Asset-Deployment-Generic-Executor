// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

interface IProposalGenericExecutor {

  struct DeploymentParams {
    address underlyingAsset;
    address aToken;
    address stableDebtToken;
    address variableDebtToken;
    address interestRateStrategy;
    uint256 ltv;
    uint256 liquidationThreshold;
    uint256 liquidationBonus;
    uint256 reserveFactor;
    uint8 decimals;
    bool enableBorrow;
    bool enableStableBorrow;
    bool enableAsCollateral;
    string underlyingAssetName;
    string aTokenName;
    string aTokenSymbol;
    string stableDebtTokenName;
    string stableDebtTokenSymbol;
    string variableDebtTokenName;
    string variableDebtTokenSymbol;
    bytes params;
  }

  function execute(DeploymentParams calldata deploymentParams) external;
}