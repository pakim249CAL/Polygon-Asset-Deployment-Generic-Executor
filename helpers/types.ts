import { BigNumber } from "ethers";

export const polygonBridgeExecutorAddress = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772';
export const polygonLendingPoolConfiguratorAddress = '0x26db2B833021583566323E3b8985999981b9F1F3';
export const shortExecutorAddress = '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5';
export const fxRootAddress = '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2';
export const oracleAddress = '0x0229F777B0fAb107F9591a41d5F02E4e98dB6f2d'; // Polygon AAVE Oracle Address
export const aTokenAddress = '0x3cb4ca3c9dc0e02d252098eebb3871ac7a43c54d'; 
export const stableDebtAddress = '0x72a053fa208eaafa53adb1a1ea6b4b2175b5735e';
export const variableDebtAddress = '0x1d22ae684f479d3da97ca19ffb03e6349d345f24';
export const aaveGovernanceV2Address = '0xEC568fffba86c094cf06b22134B23074DFE2252c';
export const treasuryAddress = '0x7734280A4337F37Fbf4651073Db7c28C80B339e9';
export const incentivesControllerAddress = '0x357D51124f59836DeD84c8a1730D72B749d8BC23';

export const ghstAddress = '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7'
export const balAddress = '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3'
export const dpiAddress = '0x85955046df4668e1dd369d2de9f3aeb98dd2a369';
export const crvAddress = '0x172370d5cd63279efa6d502dab29171933a610af';
export const sushiAddress = '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a';
export const linkAddress = '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39';
export const maticAddress = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';

export const ProposalStates = {
  PENDING: 0,
  CANCELED: 1,
  ACTIVE: 2,
  FAILED: 3,
  SUCCEEDED: 4,
  QUEUED: 5,
  EXPIRED: 6,
  EXECUTED: 7,
};

export class ProposalActions {
  targets: string[];
  values: BigNumber[];
  signatures: string[];
  calldatas: string[];
  withDelegatecalls: boolean[];
  encodedActions: string;
  encodedRootCalldata: string;
  stateSenderData: string;
  decodedFxData: any;
  decodedExecutorData: any;
  executionTime: number;

  constructor() {
    this.targets = [];
    this.values = [];
    this.signatures = [];
    this.calldatas = [];
    this.withDelegatecalls = [];
    this.encodedRootCalldata = '';
    this.encodedActions = '';
    this.stateSenderData = '';
    this.executionTime = 0;
  }
}

export class InitiateReservePayload {
  aToken: string;
  stableDebt: string;
  variableDebt: string;
  decimals: number;
  interestRateStrategy: string;
  underlying: string;
  treasury: string;
  incentivesController: string;
  underlyingName: string;
  aTokenName: string;
  aTokenSymbol: string;
  variableDebtName: string;
  variableDebtSymbol: string;
  stableDebtName: string;
  stableDebtSymbol: string;
  params: string;

  constructor(
    aToken: string = '',
    stableDebt: string = '',
    variableDebt: string = '',
    decimals: number = 18,
    interestRateStrategy: string = '',
    underlying: string = '',
    treasury: string = '',
    incentivesController: string = '',
    underlyingName: string = '',
    aTokenName: string = '',
    aTokenSymbol: string = '',
    variableDebtName: string = '',
    variableDebtSymbol: string = '',
    stableDebtName: string = '',
    stableDebtSymbol: string = '',
    params: string = ''
  ) {
    this.aToken = aToken;
    this.stableDebt = stableDebt;
    this.variableDebt = variableDebt;
    this.decimals = decimals;
    this.interestRateStrategy = interestRateStrategy;
    this.underlying = underlying;
    this.treasury = treasury;
    this.incentivesController = incentivesController;
    this.underlyingName = underlyingName;
    this.aTokenName = aTokenName;
    this.aTokenSymbol = aTokenSymbol;
    this.variableDebtName = variableDebtName;
    this.variableDebtSymbol = variableDebtSymbol;
    this.stableDebtName = stableDebtName;
    this.stableDebtSymbol = stableDebtSymbol;
    this.params = params;
  }

  get payload() {
    return [
      this.aToken, 
      this.stableDebt, 
      this.variableDebt, 
      this.decimals, 
      this.interestRateStrategy, 
      this.underlying, 
      this.treasury, 
      this.incentivesController, 
      this.underlyingName, 
      this.aTokenName, 
      this.aTokenSymbol, 
      this.variableDebtName, 
      this.variableDebtSymbol, 
      this.stableDebtName, 
      this.stableDebtSymbol, 
      this.params
    ];
  }
}

export class OraclePayload {
  assets: string[];
  sources: string[];

  constructor() {
    this.assets = [];
    this.sources = [];
  }

  get payload() {
    return [this.assets, this.sources];
  }
}

export class ReserveFactorPayload {
  asset: string;
  reserveFactor: BigNumber;

  constructor(
    asset: string = '',
    reserveFactor: BigNumber = BigNumber.from('0')
  ) {
    this.asset = asset;
    this.reserveFactor = reserveFactor;
  }
  
  get payload() {
    return [this.asset, this.reserveFactor];
  }
}

export class ConfigureReservePayload {
  asset: string;
  ltv: BigNumber;
  lt: BigNumber;
  lb: BigNumber;

  constructor(
    asset: string = '',
    ltv: BigNumber = BigNumber.from('0'),
    lt: BigNumber = BigNumber.from('0'),
    lb: BigNumber = BigNumber.from('0')
    ) {
    this.asset = asset;
    this.ltv = ltv;
    this.lt = lt;
    this.lb = lb;
  }

  get payload() {
    return [this.asset, this.ltv, this.lt, this.lb];
  }
}

export class EnableBorrowPayload {
  asset: string;
  enableStableBorrow: Boolean;

  constructor(
    asset: string = '',
    enableStableBorrow: Boolean = false
  ) {
    this.asset = asset;
    this.enableStableBorrow = enableStableBorrow;
  }

  get payload() {
    return [this.asset, this.enableStableBorrow];
  }
}

export class ProposalPayloads {
  initReserve: InitiateReservePayload[];
  reserveFactor: ReserveFactorPayload[];
  configReserve: ConfigureReservePayload[];
  borrow: EnableBorrowPayload[];
  oracle: OraclePayload; 

  constructor() {
    this.initReserve = [];
    this.reserveFactor = [];
    this.configReserve = [];
    this.borrow = [];
    this.oracle = new OraclePayload();
  }

  get initReservePayload() {
    return Array.from(this.initReserve, x => x.payload);
  }
}