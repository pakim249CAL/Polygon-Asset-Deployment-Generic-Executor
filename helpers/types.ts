import { BigNumber } from "ethers";

export class ProposalParams {
  underlying: string;
  interestRateStrategy: string;
  oracleSource: string;
  name: string;
  reserveFactor: BigNumber;
  ltv: BigNumber;
  lt: BigNumber;
  lb: BigNumber;
  borrow: Boolean;
  initReserve: Boolean;
  updateOracle: Boolean;
  updateReserveFactor: Boolean;
  updateReserveConfiguration: Boolean;

  constructor(
    underlying: string,
    interestRateStrategy: string,
    oracleSource: string,
    name: string,
    reserveFactor: BigNumber,
    ltv: BigNumber,
    lt: BigNumber,
    lb: BigNumber,
    borrow: Boolean,
    initReserve: Boolean = false,
    updateOracle: Boolean = false,
    updateReserveFactor: Boolean = false,
    updateReserveConfiguration: Boolean = false
  ) {
    this.underlying = underlying;
    this.interestRateStrategy = interestRateStrategy;
    this.oracleSource = oracleSource;
    this.name = name;
    this.reserveFactor = reserveFactor;
    this.ltv = ltv;
    this.lt = lt;
    this.lb = lb;
    this.borrow = borrow;
    this.initReserve = initReserve;
    this.updateOracle = updateOracle;
    this.updateReserveFactor = updateReserveFactor;
    this.updateReserveConfiguration = updateReserveConfiguration;
  }
}

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
    this.encodedRootCalldata = "";
    this.encodedActions = "";
    this.stateSenderData = "";
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
    aToken: string = "",
    stableDebt: string = "",
    variableDebt: string = "",
    decimals: number = 18,
    interestRateStrategy: string = "",
    underlying: string = "",
    treasury: string = "",
    incentivesController: string = "",
    underlyingName: string = "",
    aTokenName: string = "",
    aTokenSymbol: string = "",
    variableDebtName: string = "",
    variableDebtSymbol: string = "",
    stableDebtName: string = "",
    stableDebtSymbol: string = "",
    params: string = ""
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
      this.params,
    ];
  }
}

export class InitiateReserveDelegateCallPayload {
  underlying: string;
  aToken: string;
  stableDebt: string;
  variableDebt: string;
  interestRateStrategy: string;
  ltv: BigNumber;
  lt: BigNumber;
  lb: BigNumber;
  rf: BigNumber;
  decimals: BigNumber;
  borrowEnabled: Boolean;
  stableBorrowEnabled: Boolean;
  name: string;
  params: string;

  constructor(
    underlying: string = "",
    aToken: string = "",
    stableDebt: string = "",
    variableDebt: string = "",
    interestRateStrategy: string = "",
    ltv: BigNumber = BigNumber.from(0),
    lt: BigNumber = BigNumber.from(0),
    lb: BigNumber = BigNumber.from(0),
    rf: BigNumber = BigNumber.from(0),
    decimals: BigNumber = BigNumber.from(18),
    borrowEnabled: Boolean = false,
    stableBorrowEnabled: Boolean = false,
    name: string = "",
    params: string = ""
  ) {
    this.underlying = underlying;
    this.aToken = aToken;
    this.stableDebt = stableDebt;
    this.variableDebt = variableDebt;
    this.interestRateStrategy = interestRateStrategy;
    this.ltv = ltv;
    this.lt = lt;
    this.lb = lb;
    this.rf = rf;
    this.decimals = decimals;
    this.borrowEnabled = borrowEnabled;
    this.stableBorrowEnabled = stableBorrowEnabled;
    this.name = name;
    this.params = params;
  }
  get payload() {
    return [
      this.underlying,
      this.aToken,
      this.stableDebt,
      this.variableDebt,
      this.interestRateStrategy,
      this.ltv,
      this.lt,
      this.lb,
      this.rf,
      this.decimals,
      this.borrowEnabled,
      this.stableBorrowEnabled,
      this.name,
      this.params,
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

  constructor(asset: string = "", reserveFactor: BigNumber = BigNumber.from("0")) {
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
    asset: string = "",
    ltv: BigNumber = BigNumber.from("0"),
    lt: BigNumber = BigNumber.from("0"),
    lb: BigNumber = BigNumber.from("0")
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

  constructor(asset: string = "", enableStableBorrow: Boolean = false) {
    this.asset = asset;
    this.enableStableBorrow = enableStableBorrow;
  }

  get payload() {
    return [this.asset, this.enableStableBorrow];
  }
}

export class ProposalPayloads {
  initReserve: InitiateReservePayload[];
  initReserveDelegateCall: InitiateReserveDelegateCallPayload[];
  reserveFactor: ReserveFactorPayload[];
  configReserve: ConfigureReservePayload[];
  borrow: EnableBorrowPayload[];
  oracle: OraclePayload;

  constructor() {
    this.initReserve = [];
    this.initReserveDelegateCall = [];
    this.reserveFactor = [];
    this.configReserve = [];
    this.borrow = [];
    this.oracle = new OraclePayload();
  }

  get initReservePayload() {
    return [Array.from(this.initReserve, (x) => x.payload)];
  }
  get initReserveDelegateCallPayload() {
    return [Array.from(this.initReserveDelegateCall, (x) => x.payload)];
  }
}
