// SPDX-License-Identifier: AGPL-3.0
// are we business license yet
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {ILendingPoolConfigurator} from './interfaces/ILendingPoolConfigurator.sol';
import {IProposalGenericExecutor} from './interfaces/IProposalGenericExecutor.sol';
import {ILendingPoolAddressesProvider} from './interfaces/ILendingPoolAddressesProvider.sol';
/**
 * @title AssetListingProposalGenericExecutor
 * @notice Proposal payload to be executed by the Aave Governance contract via DELEGATECALL
 * @author Patrick Kim & AAVE
 **/
contract PolygonAssetListingProposalGenericExecutor is IProposalGenericExecutor {

  event ProposalExecuted();
  address public constant TREASURY_ADDRESS = 0x7734280A4337F37Fbf4651073Db7c28C80B339e9;
  address public constant INCENTIVES_CONTROLLER_ADDRESS = 0x357D51124f59836DeD84c8a1730D72B749d8BC23;
  ILendingPoolAddressesProvider public constant LENDING_POOL_ADDRESSES_PROVIDER = 
    ILendingPoolAddressesProvider(0xd05e3E715d945B59290df0ae8eF85c1BdB684744);
  /**
   * @dev Payload execution function, called once a proposal passed in the Aave governance
   */
  function execute(DeploymentParams calldata deploymentParams) external override {
    ILendingPoolConfigurator LENDING_POOL_CONFIGURATOR =
      ILendingPoolConfigurator(LENDING_POOL_ADDRESSES_PROVIDER.getLendingPoolConfigurator());

    ILendingPoolConfigurator.InitReserveInput[] memory initReserveInput;
    initReserveInput[0] = 
      ILendingPoolConfigurator.InitReserveInput(
        deploymentParams.aToken,
        deploymentParams.stableDebtToken,
        deploymentParams.variableDebtToken,
        deploymentParams.decimals,
        deploymentParams.interestRateStrategy,
        deploymentParams.underlyingAsset,
        TREASURY_ADDRESS,
        INCENTIVES_CONTROLLER_ADDRESS,
        deploymentParams.underlyingAssetName,
        deploymentParams.aTokenName,
        deploymentParams.aTokenSymbol,
        deploymentParams.variableDebtTokenName,
        deploymentParams.variableDebtTokenSymbol,
        deploymentParams.stableDebtTokenName,
        deploymentParams.stableDebtTokenSymbol,
        deploymentParams.params
      );


    LENDING_POOL_CONFIGURATOR.batchInitReserve(initReserveInput);

    if (deploymentParams.enableBorrow) {
      LENDING_POOL_CONFIGURATOR.enableBorrowingOnReserve(
        deploymentParams.underlyingAsset, 
        deploymentParams.enableStableBorrow);
    }

    LENDING_POOL_CONFIGURATOR.setReserveFactor(
      deploymentParams.underlyingAsset, 
      deploymentParams.reserveFactor);

    if (deploymentParams.enableAsCollateral) {
      LENDING_POOL_CONFIGURATOR.configureReserveAsCollateral(
        deploymentParams.underlyingAsset,
        deploymentParams.ltv,
        deploymentParams.liquidationThreshold,
        deploymentParams.liquidationBonus
      );
    }

    emit ProposalExecuted();
  }
}