// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

interface IProposalGenericExecutor {
  struct ProposalPayload {
    address underlyingAsset;
    address interestRateStrategy;
    address oracle;
    uint256 ltv;
    uint256 lt;
    uint256 lb;
    uint256 rf;
    uint8 decimals;
    bool borrowEnabled;
    bool stableBorrowEnabled;
    string underlyingAssetName;
  }
  function execute() external;
}