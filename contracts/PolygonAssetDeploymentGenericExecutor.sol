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
  string public constant ATOKEN_NAME_PREFIX = "Aave Matic Market ";
  string public constant ATOKEN_SYMBOL_PREFIX = "am";
  string public constant VAR_DEBT_NAME_PREFIX = "Aave Matic Market variable debt ";
  string public constant VAR_DEBT_SYMBOL_PREFIX = "variableDebtm";
  string public constant STABLE_DEBT_NAME_PREFIX = "Aave Matic Market stable debt ";
  string public constant STABLE_DEBT_SYMBOL_PREFIX = "stableDebtm";
  
  /**
   * @dev Payload execution function, called once a proposal passed in the Aave governance
   */
  function execute(
    address aToken,
    address stableDebt,
    address variableDebt,
    uint8 decimals,
    address interestRateStrategy,
    address underlyingAsset,
    string calldata underlyingAssetName,
    bytes calldata params
    ) external override {
    ILendingPoolConfigurator LENDING_POOL_CONFIGURATOR =
      ILendingPoolConfigurator(LENDING_POOL_ADDRESSES_PROVIDER.getLendingPoolConfigurator());

    ILendingPoolConfigurator.InitReserveInput[] memory initReserveInput;
    initReserveInput[0] = 
      ILendingPoolConfigurator.InitReserveInput(
        aToken,
        stableDebt,
        variableDebt,
        decimals,
        interestRateStrategy,
        underlyingAsset,
        TREASURY_ADDRESS,
        INCENTIVES_CONTROLLER_ADDRESS,
        underlyingAssetName,
        string(abi.encodePacked(ATOKEN_NAME_PREFIX, underlyingAssetName)),
        string(abi.encodePacked(ATOKEN_SYMBOL_PREFIX, underlyingAssetName)),
        string(abi.encodePacked(VAR_DEBT_NAME_PREFIX, underlyingAssetName)),
        string(abi.encodePacked(VAR_DEBT_SYMBOL_PREFIX, underlyingAssetName)),
        string(abi.encodePacked(STABLE_DEBT_NAME_PREFIX, underlyingAssetName)),
        string(abi.encodePacked(STABLE_DEBT_SYMBOL_PREFIX, underlyingAssetName)),
        params
      );

    LENDING_POOL_CONFIGURATOR.batchInitReserve(initReserveInput);

    emit ProposalExecuted();
  }
}