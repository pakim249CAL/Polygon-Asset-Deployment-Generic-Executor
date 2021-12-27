// SPDX-License-Identifier: AGPL-3.0
// are we business license yet
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {IAaveOracle} from './interfaces/IAaveOracle.sol';
import {ILendingPoolConfigurator} from './interfaces/ILendingPoolConfigurator.sol';
import {IProposalGenericExecutor} from './interfaces/IProposalGenericExecutor.sol';
import {IProposalDataProvider} from './interfaces/IProposalDataProvider.sol';
import {ILendingPoolAddressesProvider} from './interfaces/ILendingPoolAddressesProvider.sol';
/**
 * @title AssetListingProposalGenericExecutor
 * @notice Proposal payload to be executed by the Aave Governance contract via DELEGATECALL
 * @author Patrick Kim & AAVE
 **/
contract PolygonAssetDeploymentGenericExecutor is IProposalGenericExecutor {

  event ProposalExecuted();
  address public constant TREASURY_ADDRESS = 0x7734280A4337F37Fbf4651073Db7c28C80B339e9;
  address public constant INCENTIVES_CONTROLLER_ADDRESS = 0x357D51124f59836DeD84c8a1730D72B749d8BC23;
  address public constant ATOKEN_ADDRESS = 0x3CB4cA3c9DC0e02D252098eEbb3871AC7a43c54d;
  address public constant VAR_IMPL_ADDRESS = 0x1d22AE684F479d3Da97CA19fFB03E6349D345F24;
  address public constant STABLE_IMPL_ADDRESS = 0x72a053fA208eaAFa53ADB1a1EA6b4b2175B5735E;
  ILendingPoolAddressesProvider public constant LENDING_POOL_ADDRESSES_PROVIDER = 
    ILendingPoolAddressesProvider(0xd05e3E715d945B59290df0ae8eF85c1BdB684744);
  IAaveOracle public constant AAVE_ORACLE = 
    IAaveOracle(0x0229F777B0fAb107F9591a41d5F02E4e98dB6f2d);
  IProposalDataProvider public constant PROPOSAL_DATA_PROVIDER = 
    IProposalDataProvider(0x3EC1580919A1e7980ac171A079E3F1826A26fA63);
  string public constant ATOKEN_NAME_PREFIX = "Aave Matic Market ";
  string public constant ATOKEN_SYMBOL_PREFIX = "am";
  string public constant VAR_DEBT_NAME_PREFIX = "Aave Matic Market variable debt ";
  string public constant VAR_DEBT_SYMBOL_PREFIX = "variableDebtm";
  string public constant STABLE_DEBT_NAME_PREFIX = "Aave Matic Market stable debt ";
  string public constant STABLE_DEBT_SYMBOL_PREFIX = "stableDebtm";
  uint8 public constant decimals = 18;
  bytes public constant param = abi.encodePacked('0x10');
  
  /**
   * @dev Payload execution function, called once a proposal passed in the Aave governance
   */
  function execute() external override {
    ILendingPoolConfigurator LENDING_POOL_CONFIGURATOR =
      ILendingPoolConfigurator(LENDING_POOL_ADDRESSES_PROVIDER.getLendingPoolConfigurator());

    ILendingPoolConfigurator.InitReserveInput[] memory initReserveInput =
      new ILendingPoolConfigurator.InitReserveInput[](6);
    address[] memory assets = new address[](6);
    address[] memory sources = new address[](6);

    //Fill up the init reserve input
    for (uint256 i = 0; i < 6; i++) {
      ProposalPayload memory payload = PROPOSAL_DATA_PROVIDER.getPayload(i);
      assets[i] = payload.underlyingAsset;
      sources[i] = payload.oracle;
      initReserveInput[i] = ILendingPoolConfigurator.InitReserveInput(
        ATOKEN_ADDRESS,
        STABLE_IMPL_ADDRESS,
        VAR_IMPL_ADDRESS,
        payload.decimals,
        payload.interestRateStrategy,
        payload.underlyingAsset,
        TREASURY_ADDRESS,
        INCENTIVES_CONTROLLER_ADDRESS,
        payload.underlyingAssetName,
        string(abi.encodePacked(ATOKEN_NAME_PREFIX, payload.underlyingAssetName)),
        string(abi.encodePacked(ATOKEN_SYMBOL_PREFIX, payload.underlyingAssetName)),
        string(abi.encodePacked(VAR_DEBT_NAME_PREFIX, payload.underlyingAssetName)),
        string(abi.encodePacked(VAR_DEBT_SYMBOL_PREFIX, payload.underlyingAssetName)),
        string(abi.encodePacked(STABLE_DEBT_NAME_PREFIX, payload.underlyingAssetName)),
        string(abi.encodePacked(STABLE_DEBT_SYMBOL_PREFIX, payload.underlyingAssetName)),
        param
      );
    }

    //initiate the reserves and add oracles
    LENDING_POOL_CONFIGURATOR.batchInitReserve(initReserveInput);
    AAVE_ORACLE.setAssetSources(assets, sources);

    //now initialize the rest of the parameters
    for (uint256 i = 0; i < 6; i++) {
      ProposalPayload memory payload = PROPOSAL_DATA_PROVIDER.getPayload(i);
      LENDING_POOL_CONFIGURATOR.configureReserveAsCollateral(
        payload.underlyingAsset, 
        payload.ltv, 
        payload.lt, 
        payload.lb
      );
      if(payload.borrowEnabled) {
        LENDING_POOL_CONFIGURATOR.enableBorrowingOnReserve(
          payload.underlyingAsset,
          payload.stableBorrowEnabled);
      }
      LENDING_POOL_CONFIGURATOR.setReserveFactor(
        payload.underlyingAsset,
        payload.rf
      );
    }
    emit ProposalExecuted();
  }
}