import { BigNumber } from "ethers";
import * as ethers from "ethers";
import { 
  ProposalParams,
  ProposalActions,
  InitiateReservePayload,
  ReserveFactorPayload,
  ConfigureReservePayload,
  EnableBorrowPayload,
  ProposalPayloads,
  polygonBridgeExecutorAddress,
  polygonLendingPoolConfiguratorAddress,
  shortExecutorAddress,
  aTokenAddress,
  stableDebtAddress,
  variableDebtAddress,
  treasuryAddress,
  incentivesControllerAddress,
  oracleAddress,
  ghstParams,
  balParams,
  dpiParams,
  crvParams,
  sushiParams,
  linkParams,
  maticParams,
} from "../helpers/types";

export function pushInitReserveParams(
  proposalPayloads: ProposalPayloads,
  underlying: string, 
  interestRateStrategy: string, 
  name: string, 
  aToken: string = aTokenAddress, 
  stableDebt: string = stableDebtAddress,
  variableDebt: string = variableDebtAddress,
  treasury: string = treasuryAddress,
  incentivesController: string = incentivesControllerAddress,
  params: string = '0x10', //AFAIK this is unused
  decimals: number = 18, 
  ) 
{
  proposalPayloads.initReserve.push(
    new InitiateReservePayload(
      aToken,
      stableDebt,
      variableDebt,
      decimals,
      interestRateStrategy,
      underlying,
      treasury,
      incentivesController,
      name,
      "Aave Matic Market " + name,
      "am" + name,
      "Aave Matic Market variable debt " + name,
      "variableDebtm" + name,
      "Aave Matic Market stable debt " + name,
      "stableDebtm" + name,
      params
    )
  );
  return proposalPayloads;
}

export function pushBorrowParams(
  proposalPayloads: ProposalPayloads,
  underlying: string, 
  borrow: Boolean,
  ) 
{
  proposalPayloads.borrow.push(
    new EnableBorrowPayload(underlying, borrow)
  );
  return proposalPayloads;
}

export function pushReserveFactorParams(
  proposalPayloads: ProposalPayloads,
  underlying: string,
  reserveFactor: BigNumber,
) {
  proposalPayloads.reserveFactor.push(
    new ReserveFactorPayload(underlying, reserveFactor)
  );
  return proposalPayloads;
}

export function pushConfigureReserveParams(
  proposalPayloads: ProposalPayloads,
  underlying: string,
  ltv: BigNumber,
  lt: BigNumber,
  lb: BigNumber,
) {
  proposalPayloads.configReserve.push(
    new ConfigureReservePayload(underlying, ltv, lt, lb)
  );
  return proposalPayloads;
}

export function pushOracleParams(
  proposalPayloads: ProposalPayloads,
  underlying: string,
  oracleSource: string,
) {
  proposalPayloads.oracle.assets.push(underlying);
  proposalPayloads.oracle.sources.push(oracleSource);
  return proposalPayloads;
}

export function addAction(
  proposalActions: ProposalActions,
  target: string,
  abi: string[], 
  signature: string,
  params: any,
  delegateCall: boolean = false,
  value: BigNumber = BigNumber.from('0')
) 
{
  let encodedArguments = ethers.utils.defaultAbiCoder.encode(
    abi, params
  );
  proposalActions.targets.push(target);
  proposalActions.values.push(value);
  proposalActions.signatures.push(signature);
  proposalActions.calldatas.push(encodedArguments)
  proposalActions.withDelegatecalls.push(delegateCall);
  return proposalActions;
}

export function addBorrowAction(proposalActions: ProposalActions, payload: any) {
  return addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    ['address', 'bool'],
    "enableBorrowingOnReserve(address,bool)",
    payload
  );
}

export function addReserveFactorAction(proposalActions: ProposalActions, payload: any) {
  return addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    ['address', 'uint256'],
    "setReserveFactor(address,uint256)",
    payload
  );
}

export function addConfigureReserveAction(proposalActions: ProposalActions, payload: any) {
  return addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    ['address', 'uint256', 'uint256', 'uint256'],
    "configureReserveAsCollateral(address,uint256,uint256,uint256)",
    payload
  );
}

export function addOracleAction(proposalActions: ProposalActions, payload: any) {
  return addAction(
    proposalActions,
    oracleAddress,
    ["address[]", "address[]"],
    "setAssetSources(address[],address[])",
    payload
  );
}

// Encodes the actions that will be executed
export function encodeActions(proposalActions: ProposalActions) {
  return ethers.utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]'],
    [
        proposalActions.targets,
        proposalActions.values,
        proposalActions.signatures,
        proposalActions.calldatas,
        proposalActions.withDelegatecalls,
    ]
    );
}

// Packages the calldata to be sent from FxRoot to the executor on Polygon
export function encodeRootCalldata(encodedActions: string) {
  return ethers.utils.defaultAbiCoder.encode(
    ['address', 'bytes'],
    [polygonBridgeExecutorAddress, encodedActions]
    );
}

// Creates what should be the representation of the
// calldata output by the StateSender contract
export function emulateFxRootEncodedCalldata(encodedActions: string) {
  return ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'bytes'],
    [shortExecutorAddress, polygonBridgeExecutorAddress, encodedActions]
  );
}

export function decodeFxRootEncodedCalldata(fxRootEncodedRootCalldata: string) {
  return ethers.utils.defaultAbiCoder.decode(
    ['address', 'address', 'bytes'], 
    fxRootEncodedRootCalldata);
}

export function decodeExecutorData(decodedFxData: any) {
  return ethers.utils.defaultAbiCoder.decode(
    ['address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]'], 
    decodedFxData);
}

export function fillPolygonProposalActions() {
  let proposalActions = new ProposalActions();
  let proposalPayloads = new ProposalPayloads();
  let proposalParams: ProposalParams[] = 
    [ghstParams, balParams, dpiParams, crvParams, sushiParams, linkParams, maticParams];
  
  for (let i = 0; i < proposalParams.length; i++) {
    if (proposalParams[i].initReserve) {
      proposalPayloads = pushInitReserveParams(
        proposalPayloads,
        proposalParams[i].underlying,
        proposalParams[i].interestRateStrategy,
        proposalParams[i].name,
      );
    }
    if (proposalParams[i].borrow) {
      proposalPayloads = pushBorrowParams(
        proposalPayloads,
        proposalParams[i].underlying,
        false
      );
    }
    if (proposalParams[i].updateReserveFactor) {
      proposalPayloads = pushReserveFactorParams(
        proposalPayloads,
        proposalParams[i].underlying,
        proposalParams[i].reserveFactor
      );
    }
    if (proposalParams[i].updateReserveConfiguration) {
      proposalPayloads = pushConfigureReserveParams(
        proposalPayloads,
        proposalParams[i].underlying,
        proposalParams[i].ltv,
        proposalParams[i].lt,
        proposalParams[i].lb
      );
    }
    if (proposalParams[i].updateOracle) {
      proposalPayloads = pushOracleParams(
        proposalPayloads,
        proposalParams[i].underlying,
        proposalParams[i].oracleSource
      );
    }
  }

  
  proposalActions = addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    ['(address,address,address,uint8,address,address,address,address,string,string,string,string,string,string,string,bytes)[]'],
    "batchInitReserve((address,address,address,uint8,address,address,address,address,string,string,string,string,string,string,string,bytes)[])",
    proposalPayloads.initReservePayload
  );
  for (let i = 0; i < proposalPayloads.borrow.length; i++) {
    proposalActions = addBorrowAction(
      proposalActions, 
      proposalPayloads.borrow[i].payload);
  }
  for (let i = 0; i < proposalPayloads.reserveFactor.length; i++) {
    proposalActions = addReserveFactorAction(
      proposalActions, 
      proposalPayloads.reserveFactor[i].payload);
  }
  for (let i = 0; i < proposalPayloads.configReserve.length; i++) {
    proposalActions = addConfigureReserveAction(
      proposalActions, 
      proposalPayloads.configReserve[i].payload);
  }
  //broken
  proposalActions = addOracleAction(
    proposalActions,
    proposalPayloads.oracle.payload);
  
  //Encoding
  proposalActions.encodedActions = encodeActions(proposalActions);
  proposalActions.encodedRootCalldata = encodeRootCalldata(proposalActions.encodedActions);
  proposalActions.stateSenderData = emulateFxRootEncodedCalldata(proposalActions.encodedActions);
  proposalActions.decodedFxData = decodeFxRootEncodedCalldata(proposalActions.stateSenderData);
  proposalActions.decodedExecutorData = decodeExecutorData(proposalActions.decodedFxData[2]);
  return proposalActions;
}