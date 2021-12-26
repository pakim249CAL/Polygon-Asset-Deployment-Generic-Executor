import { BigNumber } from "ethers";
import * as ethers from "ethers";
import { 
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
  ghstAddress,
  balAddress,
  dpiAddress,
  crvAddress,
  sushiAddress,
  linkAddress,
  maticAddress
} from "../helpers/types";

export function pushInitReserveParams(
  proposalPayloads: ProposalPayloads,
  underlying: string, 
  interestRateStrategy: string, 
  oracleSource: string,
  name: string, 
  reserveFactor: BigNumber,
  ltv: BigNumber,
  lt: BigNumber,
  lb: BigNumber,
  borrow: Boolean,
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
  if (borrow) {
    proposalPayloads.borrow.push(
      new EnableBorrowPayload(underlying, false)
    )
  }
  proposalPayloads.reserveFactor.push(
    new ReserveFactorPayload(underlying, reserveFactor)
  );
  proposalPayloads.configReserve.push(
    new ConfigureReservePayload(underlying, ltv, lt, lb)
  );

  proposalPayloads.oracle.assets.push(underlying);
  proposalPayloads.oracle.sources.push(oracleSource);
  return proposalPayloads;
}

export function addAction(
  proposalActions: ProposalActions,
  target: string,
  abi: string, 
  signature: string,
  params: any,
  delegateCall: boolean = false,
  value: BigNumber = BigNumber.from('0')
) 
{
  let encodedArguments = ethers.utils.defaultAbiCoder.encode(
    [abi], [params]
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
    "(address,bool)",
    "enableBorrowingOnReserve(address,bool)",
    payload
  );
}

export function addReserveFactorAction(proposalActions: ProposalActions, payload: any) {
  return addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    "(address,uint256)",
    "setReserveFactor(address,uint256)",
    payload
  );
}

export function addConfigureReserveAction(proposalActions: ProposalActions, payload: any) {
  return addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    "(address,uint256,uint256,uint256)",
    "configureReserveAsCollateral(address,uint256,uint256,uint256)",
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
  
  proposalPayloads = pushInitReserveParams(
    proposalPayloads,
    ghstAddress,
    '0xBb480ae4e2cf28FBE80C9b61ab075f6e7C4dB468',
    '0xe638249AF9642CdA55A92245525268482eE4C67b',
    'GHST',
    BigNumber.from('2000'),
    BigNumber.from('2500'),
    BigNumber.from('4500'),
    BigNumber.from('11250'),
    true
  );

  proposalPayloads = pushInitReserveParams(
    proposalPayloads,
    balAddress,
    '0x9025C2d672afA29f43cB59b3035CaCfC401F5D62',
    '0x03CD157746c61F44597dD54C6f6702105258C722',
    'BAL',
    BigNumber.from('2000'),
    BigNumber.from('2500'),
    BigNumber.from('4500'),
    BigNumber.from('11000'),
    true
  );

  proposalPayloads = pushInitReserveParams(
    proposalPayloads,
    dpiAddress,
    '0x6405F880E431403588e92b241Ca15603047ef8a4',
    '0xC70aAF9092De3a4E5000956E672cDf5E996B4610',
    'DPI',
    BigNumber.from('2000'),
    BigNumber.from('2500'),
    BigNumber.from('4500'),
    BigNumber.from('11000'),
    false
  );

  proposalPayloads = pushInitReserveParams(
    proposalPayloads,
    crvAddress,
    '0xBD67eB7e00f43DAe9e3d51f7d509d4730Fe5988e',
    '0x1CF68C76803c9A415bE301f50E82e44c64B7F1D4',
    'CRV',
    BigNumber.from('2000'),
    BigNumber.from('2500'),
    BigNumber.from('4500'),
    BigNumber.from('11000'),
    true
  );

  proposalPayloads = pushInitReserveParams(
    proposalPayloads,
    sushiAddress,
    '0x835699Bf98f6a7fDe5713c42c118Fb80fA059737',
    '0x17414Eb5159A082e8d41D243C1601c2944401431',
    'SUSHI',
    BigNumber.from('3500'),
    BigNumber.from('2500'),
    BigNumber.from('4500'),
    BigNumber.from('11000'),
    false
  );

  proposalPayloads = pushInitReserveParams(
    proposalPayloads,
    linkAddress,
    '0x5641Bb58f4a92188A6F16eE79C8886Cf42C561d3',
    '0xb77fa460604b9C6435A235D057F7D319AC83cb53',
    'LINK',
    BigNumber.from('1000'),
    BigNumber.from('6500'),
    BigNumber.from('7000'),
    BigNumber.from('11000'),
    true
  );

  proposalPayloads.configReserve.push(
    new ConfigureReservePayload(
      maticAddress,
      BigNumber.from('6500'),
      BigNumber.from('7000'),
      BigNumber.from('11000')
    )
  );

  
  proposalActions = addAction(
    proposalActions,
    polygonLendingPoolConfiguratorAddress,
    "(address,address,address,uint8,address,address,address,address,string,string,string,string,string,string,string,bytes)[]",
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
  /*console.log(proposalPayloads.oracle.payload);
  proposalActions = addAction(
    proposalActions,
    oracleAddress,
    "(address[],address[])",
    "setAssetSources(address[],address[])",
    proposalPayloads.oracle.payload
  );*/
  
  //Encoding
  proposalActions.encodedActions = encodeActions(proposalActions);
  proposalActions.encodedRootCalldata = encodeRootCalldata(proposalActions.encodedActions);
  proposalActions.stateSenderData = emulateFxRootEncodedCalldata(proposalActions.encodedActions);
  proposalActions.decodedFxData = decodeFxRootEncodedCalldata(proposalActions.stateSenderData);
  proposalActions.decodedExecutorData = decodeExecutorData(proposalActions.decodedFxData[2]);
  return proposalActions;
}