import { BigNumber } from "ethers";
import { ProposalParams } from "./types";

// Polygon fx-portal contracts (https://github.com/fx-portal/contracts)
export const fxRootAddress = "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2";
export const fxChildAddress = "0x8397259c983751DAf40400790063935a11afa28a";

// Aave Governance
export const aaveGovernanceV2Address = "0xEC568fffba86c094cf06b22134B23074DFE2252c";
export const shortExecutorAddress = "0xEE56e2B3D491590B5b31738cC34d5232F378a8D5";
export const polygonBridgeExecutorAddress = "0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772";

// Polygon Aave Market
export const treasuryAddress = "0x7734280A4337F37Fbf4651073Db7c28C80B339e9";
export const incentivesControllerAddress = "0x357D51124f59836DeD84c8a1730D72B749d8BC23";
export const oracleAddress = "0x0229F777B0fAb107F9591a41d5F02E4e98dB6f2d"; // Polygon AAVE Oracle Address
export const polygonLendingPoolConfiguratorAddress = "0x26db2B833021583566323E3b8985999981b9F1F3";
export const polygonLendingPoolAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf";

// Proposal Logic on Polygon
export const deployerAddress = "0x685582B372f7947C0Cb51A82f9101605294e9f64";

// Token Logic Implementation Contracts
export const aTokenAddress = "0x3cb4ca3c9dc0e02d252098eebb3871ac7a43c54d";
export const stableDebtAddress = "0x72a053fa208eaafa53adb1a1ea6b4b2175b5735e";
export const variableDebtAddress = "0x1d22ae684f479d3da97ca19ffb03e6349d345f24";

// Token Strings
export const ATOKEN_NAME_PREFIX = "Aave Matic Market ";
export const ATOKEN_SYMBOL_PREFIX = "am";
export const VAR_DEBT_NAME_PREFIX = "Aave Matic Market variable debt ";
export const VAR_DEBT_SYMBOL_PREFIX = "variableDebtm";
export const STABLE_DEBT_NAME_PREFIX = "Aave Matic Market stable debt ";
export const STABLE_DEBT_SYMBOL_PREFIX = "stableDebtm";

// GHST Constants
const GHST_UNDERLYING_ASSET: string = "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7";
const GHST_INTEREST_RATE_STRATEGY: string = "0xBb480ae4e2cf28FBE80C9b61ab075f6e7C4dB468";
const GHST_ORACLE: string = "0xe638249AF9642CdA55A92245525268482eE4C67b";
const GHST_UNDERLYING_ASSET_NAME = "GHST";
const GHST_RESERVE_FACTOR: BigNumber = BigNumber.from("2000");
const GHST_LTV: BigNumber = BigNumber.from("2500");
const GHST_LT: BigNumber = BigNumber.from("4500");
const GHST_LB: BigNumber = BigNumber.from("11250");
const GHST_BORROW: Boolean = true;
const GHST_INIT_RESERVE: Boolean = true;
const GHST_UPDATE_ORACLE: Boolean = true;
const GHST_UPDATE_RESERVE_FACTOR: Boolean = true;
const GHST_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

// MATIC Constants
const MATIC_UNDERLYING_ASSET: string = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
const MATIC_INTEREST_RATE_STRATEGY: string = "";
const MATIC_ORACLE: string = "";
const MATIC_UNDERLYING_ASSET_NAME = "WMATIC";
const MATIC_RESERVE_FACTOR: BigNumber = BigNumber.from("0");
const MATIC_LTV: BigNumber = BigNumber.from("6500");
const MATIC_LT: BigNumber = BigNumber.from("7000");
const MATIC_LB: BigNumber = BigNumber.from("11000");
const MATIC_BORROW: Boolean = false;
const MATIC_INIT_RESERVE: Boolean = false;
const MATIC_UPDATE_ORACLE: Boolean = false;
const MATIC_UPDATE_RESERVE_FACTOR: Boolean = false;
const MATIC_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

// BAL Constants
const BAL_UNDERLYING_ASSET: string = "0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3";
const BAL_INTEREST_RATE_STRATEGY: string = "0x9025C2d672afA29f43cB59b3035CaCfC401F5D62";
const BAL_ORACLE: string = "0x03CD157746c61F44597dD54C6f6702105258C722";
const BAL_UNDERLYING_ASSET_NAME = "BAL";
const BAL_RESERVE_FACTOR: BigNumber = BigNumber.from("2000");
const BAL_LTV: BigNumber = BigNumber.from("2000");
const BAL_LT: BigNumber = BigNumber.from("4500");
const BAL_LB: BigNumber = BigNumber.from("11000");
const BAL_BORROW: Boolean = true;
const BAL_INIT_RESERVE: Boolean = true;
const BAL_UPDATE_ORACLE: Boolean = true;
const BAL_UPDATE_RESERVE_FACTOR: Boolean = true;
const BAL_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

// DPI Constants
const DPI_UNDERLYING_ASSET: string = "0x85955046df4668e1dd369d2de9f3aeb98dd2a369";
const DPI_INTEREST_RATE_STRATEGY: string = "0x6405F880E431403588e92b241Ca15603047ef8a4";
const DPI_ORACLE: string = "0xC70aAF9092De3a4E5000956E672cDf5E996B4610";
const DPI_UNDERLYING_ASSET_NAME = "DPI";
const DPI_RESERVE_FACTOR: BigNumber = BigNumber.from("2000");
const DPI_LTV: BigNumber = BigNumber.from("2000");
const DPI_LT: BigNumber = BigNumber.from("4500");
const DPI_LB: BigNumber = BigNumber.from("11000");
const DPI_BORROW: Boolean = false;
const DPI_INIT_RESERVE: Boolean = true;
const DPI_UPDATE_ORACLE: Boolean = true;
const DPI_UPDATE_RESERVE_FACTOR: Boolean = true;
const DPI_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

// CRV Constants
const CRV_UNDERLYING_ASSET: string = "0x172370d5cd63279efa6d502dab29171933a610af";
const CRV_INTEREST_RATE_STRATEGY: string = "0xBD67eB7e00f43DAe9e3d51f7d509d4730Fe5988e";
const CRV_ORACLE: string = "0x1CF68C76803c9A415bE301f50E82e44c64B7F1D4";
const CRV_UNDERLYING_ASSET_NAME = "CRV";
const CRV_RESERVE_FACTOR: BigNumber = BigNumber.from("2000");
const CRV_LTV: BigNumber = BigNumber.from("2000");
const CRV_LT: BigNumber = BigNumber.from("4500");
const CRV_LB: BigNumber = BigNumber.from("11000");
const CRV_BORROW: Boolean = true;
const CRV_INIT_RESERVE: Boolean = true;
const CRV_UPDATE_ORACLE: Boolean = true;
const CRV_UPDATE_RESERVE_FACTOR: Boolean = true;
const CRV_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

// SUSHI Constants
const SUSHI_UNDERLYING_ASSET: string = "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a";
const SUSHI_INTEREST_RATE_STRATEGY: string = "0x835699Bf98f6a7fDe5713c42c118Fb80fA059737";
const SUSHI_ORACLE: string = "0x17414Eb5159A082e8d41D243C1601c2944401431";
const SUSHI_UNDERLYING_ASSET_NAME = "SUSHI";
const SUSHI_RESERVE_FACTOR: BigNumber = BigNumber.from("3500");
const SUSHI_LTV: BigNumber = BigNumber.from("2000");
const SUSHI_LT: BigNumber = BigNumber.from("4500");
const SUSHI_LB: BigNumber = BigNumber.from("11000");
const SUSHI_BORROW: Boolean = false;
const SUSHI_INIT_RESERVE: Boolean = true;
const SUSHI_UPDATE_ORACLE: Boolean = true;
const SUSHI_UPDATE_RESERVE_FACTOR: Boolean = true;
const SUSHI_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

// LINK Constants
const LINK_UNDERLYING_ASSET: string = "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39";
const LINK_INTEREST_RATE_STRATEGY: string = "0x5641Bb58f4a92188A6F16eE79C8886Cf42C561d3";
const LINK_ORACLE: string = "0xb77fa460604b9C6435A235D057F7D319AC83cb53";
const LINK_UNDERLYING_ASSET_NAME = "LINK";
const LINK_RESERVE_FACTOR: BigNumber = BigNumber.from("1000");
const LINK_LTV: BigNumber = BigNumber.from("6500");
const LINK_LT: BigNumber = BigNumber.from("7000");
const LINK_LB: BigNumber = BigNumber.from("11000");
const LINK_BORROW: Boolean = true;
const LINK_INIT_RESERVE: Boolean = true;
const LINK_UPDATE_ORACLE: Boolean = true;
const LINK_UPDATE_RESERVE_FACTOR: Boolean = true;
const LINK_UPDATE_RESERVE_CONFIGURATION: Boolean = true;

export const ghstParams: ProposalParams = new ProposalParams(
  GHST_UNDERLYING_ASSET,
  GHST_INTEREST_RATE_STRATEGY,
  GHST_ORACLE,
  GHST_UNDERLYING_ASSET_NAME,
  GHST_RESERVE_FACTOR,
  GHST_LTV,
  GHST_LT,
  GHST_LB,
  GHST_BORROW,
  GHST_INIT_RESERVE,
  GHST_UPDATE_ORACLE,
  GHST_UPDATE_RESERVE_FACTOR,
  GHST_UPDATE_RESERVE_CONFIGURATION
);

export const balParams: ProposalParams = new ProposalParams(
  BAL_UNDERLYING_ASSET,
  BAL_INTEREST_RATE_STRATEGY,
  BAL_ORACLE,
  BAL_UNDERLYING_ASSET_NAME,
  BAL_RESERVE_FACTOR,
  BAL_LTV,
  BAL_LT,
  BAL_LB,
  BAL_BORROW,
  BAL_INIT_RESERVE,
  BAL_UPDATE_ORACLE,
  BAL_UPDATE_RESERVE_FACTOR,
  BAL_UPDATE_RESERVE_CONFIGURATION
);

export const dpiParams: ProposalParams = new ProposalParams(
  DPI_UNDERLYING_ASSET,
  DPI_INTEREST_RATE_STRATEGY,
  DPI_ORACLE,
  DPI_UNDERLYING_ASSET_NAME,
  DPI_RESERVE_FACTOR,
  DPI_LTV,
  DPI_LT,
  DPI_LB,
  DPI_BORROW,
  DPI_INIT_RESERVE,
  DPI_UPDATE_ORACLE,
  DPI_UPDATE_RESERVE_FACTOR,
  DPI_UPDATE_RESERVE_CONFIGURATION
);

export const crvParams: ProposalParams = new ProposalParams(
  CRV_UNDERLYING_ASSET,
  CRV_INTEREST_RATE_STRATEGY,
  CRV_ORACLE,
  CRV_UNDERLYING_ASSET_NAME,
  CRV_RESERVE_FACTOR,
  CRV_LTV,
  CRV_LT,
  CRV_LB,
  CRV_BORROW,
  CRV_INIT_RESERVE,
  CRV_UPDATE_ORACLE,
  CRV_UPDATE_RESERVE_FACTOR,
  CRV_UPDATE_RESERVE_CONFIGURATION
);

export const sushiParams: ProposalParams = new ProposalParams(
  SUSHI_UNDERLYING_ASSET,
  SUSHI_INTEREST_RATE_STRATEGY,
  SUSHI_ORACLE,
  SUSHI_UNDERLYING_ASSET_NAME,
  SUSHI_RESERVE_FACTOR,
  SUSHI_LTV,
  SUSHI_LT,
  SUSHI_LB,
  SUSHI_BORROW,
  SUSHI_INIT_RESERVE,
  SUSHI_UPDATE_ORACLE,
  SUSHI_UPDATE_RESERVE_FACTOR,
  SUSHI_UPDATE_RESERVE_CONFIGURATION
);

export const linkParams: ProposalParams = new ProposalParams(
  LINK_UNDERLYING_ASSET,
  LINK_INTEREST_RATE_STRATEGY,
  LINK_ORACLE,
  LINK_UNDERLYING_ASSET_NAME,
  LINK_RESERVE_FACTOR,
  LINK_LTV,
  LINK_LT,
  LINK_LB,
  LINK_BORROW,
  LINK_INIT_RESERVE,
  LINK_UPDATE_ORACLE,
  LINK_UPDATE_RESERVE_FACTOR,
  LINK_UPDATE_RESERVE_CONFIGURATION
);

export const maticParams: ProposalParams = new ProposalParams(
  MATIC_UNDERLYING_ASSET,
  MATIC_INTEREST_RATE_STRATEGY,
  MATIC_ORACLE,
  MATIC_UNDERLYING_ASSET_NAME,
  MATIC_RESERVE_FACTOR,
  MATIC_LTV,
  MATIC_LT,
  MATIC_LB,
  MATIC_BORROW,
  MATIC_INIT_RESERVE,
  MATIC_UPDATE_ORACLE,
  MATIC_UPDATE_RESERVE_FACTOR,
  MATIC_UPDATE_RESERVE_CONFIGURATION
);
