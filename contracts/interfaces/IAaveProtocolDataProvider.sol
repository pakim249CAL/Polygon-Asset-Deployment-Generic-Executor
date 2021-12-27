// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

interface IAaveProtocolDataProvider {
    function getReserveConfigurationData(address asset) external view returns (
      uint256 decimals,
      uint256 ltv,
      uint256 liquidationThreshold,
      uint256 liquidationBonus,
      uint256 reserveFactor,
      bool usageAsCollateralEnabled,
      bool borrowingEnabled,
      bool stableBorrowRateEnabled,
      bool isActive,
      bool isFrozen
    );

    function getReserveTokensAddresses(address asset) external view returns (
      address aTokenAddress,
      address stableDebtTokenAddress,
      address variableDebtTokenAddress
    );
}
