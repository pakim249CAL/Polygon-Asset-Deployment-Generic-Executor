const hre = require("hardhat");
const ethers = require("ethers");
const fs = require('fs')

class ProposalActions {
    targets;
    values;
    signatures;
    calldatas;
    withDelegatecalls;
    encodedActions;
    encodedRootCalldata;
    executionTime;
  
    constructor() {
      this.targets = [];
      this.values = [];
      this.signatures = [];
      this.calldatas = [];
      this.withDelegatecalls = [];
      this.encodedRootCalldata = '';
      this.encodedActions = '';
      this.executionTime = 0;
    }
  }

async function main() {

  //Remove this for the real thing.
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"],
    });

  //Set to the correct signer.
  const signer = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");

  let proposalActions = new ProposalActions();
  let aaveGovernanceV2;
  const polygonBridgeExecutorAddress = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772';
  const polygonLendingPoolConfiguratorAddress = '0x26db2B833021583566323E3b8985999981b9F1F3';
  const shortExecutorAddress = '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5';
  const fxRootAddress = '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2';
  const oracleAddress = '0x0229F777B0fAb107F9591a41d5F02E4e98dB6f2d'; // Polygon AAVE Oracle Address
  const aTokenAddress = '0x3cb4ca3c9dc0e02d252098eebb3871ac7a43c54d'; 
  const stableDebtAddress = '0x72a053fa208eaafa53adb1a1ea6b4b2175b5735e';
  const variableDebtAddress = '0x1d22ae684f479d3da97ca19ffb03e6349d345f24';
  const aaveGovernanceV2Address = '0xEC568fffba86c094cf06b22134B23074DFE2252c';
  const treasuryAddress = '0x7734280A4337F37Fbf4651073Db7c28C80B339e9';
  const incentivesControllerAddress = '0x357D51124f59836DeD84c8a1730D72B749d8BC23';

  const ghstAddress = '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7'
  const balAddress = '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3'
  const dpiAddress = '0x85955046df4668e1dd369d2de9f3aeb98dd2a369';
  const crvAddress = '0x172370d5cd63279efa6d502dab29171933a610af';
  const sushiAddress = '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a';
  const linkAddress = '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39';
  const maticAddress = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';

  const junkParams = '0x10'; //this is not used

  const initReserveAbi = [
      "(address,address,address,uint8,address,address,address,address,string,string,string,string,string,string,string,bytes)[]"
  ]


  const initReserveParams = [
      [
          [
              aTokenAddress,
              stableDebtAddress,
              variableDebtAddress,
              18,
              '0xBb480ae4e2cf28FBE80C9b61ab075f6e7C4dB468',
              ghstAddress,
              treasuryAddress,
              incentivesControllerAddress,
              "GHST",
              "Aave Matic Market GHST",
              "amGHST",
              "Aave Matic Market variable debt GHST",
              "variableDebtmGHST",
              "Aave Matic Market stable debt GHST",
              "stableDebtmGHST",
              junkParams
          ],
          [
              aTokenAddress,
              stableDebtAddress,
              variableDebtAddress,
              18,
              '0x9025C2d672afA29f43cB59b3035CaCfC401F5D62',
              balAddress,
              treasuryAddress,
              incentivesControllerAddress,
              "BAL",
              "Aave Matic Market BAL",
              "amBAL",
              "Aave Matic Market variable debt BAL",
              "variableDebtmBAL",
              "Aave Matic Market stable debt BAL",
              "stableDebtmBAL",
              junkParams
          ],
          [
              aTokenAddress,
              stableDebtAddress,
              variableDebtAddress,
              18,
              '0x6405F880E431403588e92b241Ca15603047ef8a4',
              dpiAddress,
              treasuryAddress,
              incentivesControllerAddress,
              "DPI",
              "Aave Matic Market DPI",
              "amDPI",
              "Aave Matic Market variable debt DPI",
              "variableDebtmDPI",
              "Aave Matic Market stable debt DPI",
              "stableDebtmDPI",
              junkParams
          ],
          [
              aTokenAddress,
              stableDebtAddress,
              variableDebtAddress,
              18,
              '0xBD67eB7e00f43DAe9e3d51f7d509d4730Fe5988e',
              crvAddress,
              treasuryAddress,
              incentivesControllerAddress,
              "CRV",
              "Aave Matic Market CRV",
              "amCRV",
              "Aave Matic Market variable debt CRV",
              "variableDebtmCRV",
              "Aave Matic Market stable debt CRV",
              "stableDebtmCRV",
              junkParams
          ],
          [
              aTokenAddress,
              stableDebtAddress,
              variableDebtAddress,
              18,
              '0x835699Bf98f6a7fDe5713c42c118Fb80fA059737',
              sushiAddress,
              treasuryAddress,
              incentivesControllerAddress,
              "SUSHI",
              "Aave Matic Market SUSHI",
              "amSUSHI",
              "Aave Matic Market variable debt SUSHI",
              "variableDebtmSUSHI",
              "Aave Matic Market stable debt SUSHI",
              "stableDebtmSUSHI",
              junkParams
          ],
          [
              aTokenAddress,
              stableDebtAddress,
              variableDebtAddress,
              18,
              '0x5641Bb58f4a92188A6F16eE79C8886Cf42C561d3',
              linkAddress,
              treasuryAddress,
              incentivesControllerAddress,
              "LINK",
              "Aave Matic Market LINK",
              "amLINK",
              "Aave Matic Market variable debt LINK",
              "variableDebtmLINK",
              "Aave Matic Market stable debt LINK",
              "stableDebtmLINK",
              junkParams
          ]
      ]
  ];


  function addAssetAction(initReserveParams) {
    let encodedArguments = ethers.utils.defaultAbiCoder.encode(initReserveAbi, initReserveParams);
    proposalActions.targets.push(polygonLendingPoolConfiguratorAddress);
    proposalActions.values.push(ethers.BigNumber.from('0'));
    proposalActions.signatures.push('batchInitReserve(' + initReserveAbi + ')');
    proposalActions.calldatas.push(encodedArguments);
    proposalActions.withDelegatecalls.push(false);
  }

  addAssetAction(initReserveParams);

  function addBorrowAction(tokenAddress) {
      let encodedArguments = ethers.utils.defaultAbiCoder.encode(['address', 'bool'], [tokenAddress, false]);
      proposalActions.targets.push(polygonLendingPoolConfiguratorAddress);
      proposalActions.values.push(ethers.BigNumber.from('0'));
      proposalActions.signatures.push('enableBorrowingOnReserve(address,bool)');
      proposalActions.calldatas.push(encodedArguments);
      proposalActions.withDelegatecalls.push(false);
  }

  addBorrowAction(ghstAddress);
  addBorrowAction(balAddress);
  addBorrowAction(crvAddress);
  addBorrowAction(linkAddress);

  function addReserveFactor(tokenAddress, reserveFactor) {
      let encodedArguments = ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256'], 
        [tokenAddress, reserveFactor]);
      proposalActions.targets.push(polygonLendingPoolConfiguratorAddress);
      proposalActions.values.push(ethers.BigNumber.from('0'));
      proposalActions.signatures.push('setReserveFactor(address,uint256)');
      proposalActions.calldatas.push(encodedArguments);
      proposalActions.withDelegatecalls.push(false);
  }

  addReserveFactor(ghstAddress, ethers.BigNumber.from('2000'));
  addReserveFactor(balAddress, ethers.BigNumber.from('2000'));
  addReserveFactor(dpiAddress, ethers.BigNumber.from('2000'));
  addReserveFactor(crvAddress, ethers.BigNumber.from('2000'));
  addReserveFactor(sushiAddress, ethers.BigNumber.from('3500'));
  addReserveFactor(linkAddress, ethers.BigNumber.from('1000'));

  function addConfigureReserveAsCollateralAction(tokenAddress, ltv, lt, lb) {
      let encodedArguments = ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'uint256', 'uint256'], 
        [tokenAddress, ltv, lt, lb]);
      proposalActions.targets.push(polygonLendingPoolConfiguratorAddress);
      proposalActions.values.push(ethers.BigNumber.from('0'));
      proposalActions.signatures.push('configureReserveAsCollateral(address,uint256,uint256,uint256)');
      proposalActions.calldatas.push(encodedArguments);
      proposalActions.withDelegatecalls.push(false);
  }

  addConfigureReserveAsCollateralAction(
    ghstAddress, 
    ethers.BigNumber.from('2500'), 
    ethers.BigNumber.from('4500'), 
    ethers.BigNumber.from('11250'));
  addConfigureReserveAsCollateralAction(
    balAddress, 
    ethers.BigNumber.from('2000'), 
    ethers.BigNumber.from('4500'), 
    ethers.BigNumber.from('11000'));
  addConfigureReserveAsCollateralAction(
    dpiAddress, 
    ethers.BigNumber.from('2000'), 
    ethers.BigNumber.from('4500'), 
    ethers.BigNumber.from('11000'));
  addConfigureReserveAsCollateralAction(
    crvAddress, 
    ethers.BigNumber.from('2000'), 
    ethers.BigNumber.from('4500'), 
    ethers.BigNumber.from('11000'));
  addConfigureReserveAsCollateralAction(
    sushiAddress, 
    ethers.BigNumber.from('2000'), 
    ethers.BigNumber.from('4500'), 
    ethers.BigNumber.from('11000'));
  addConfigureReserveAsCollateralAction(
    linkAddress, 
    ethers.BigNumber.from('5000'), 
    ethers.BigNumber.from('6500'), 
    ethers.BigNumber.from('10750'));
  addConfigureReserveAsCollateralAction(
    maticAddress, 
    ethers.BigNumber.from('6500'), 
    ethers.BigNumber.from('7000'), 
    ethers.BigNumber.from('11000'));


  //Cannot test for this until ownership of oracle is transferred
  //Add oracles for all new assets
  const oracleEncodedArguments = ethers.utils.defaultAbiCoder.encode([
  'address[]', //assets
  'address[]' //oracles
  ], [
  [
      ghstAddress,
      balAddress,
      dpiAddress,
      crvAddress,
      sushiAddress,
      linkAddress
  ],
  [
      '0xe638249AF9642CdA55A92245525268482eE4C67b',
      '0x03CD157746c61F44597dD54C6f6702105258C722',
      '0xC70aAF9092De3a4E5000956E672cDf5E996B4610', 
      '0x1CF68C76803c9A415bE301f50E82e44c64B7F1D4',
      '0x17414Eb5159A082e8d41D243C1601c2944401431',
      '0xb77fa460604b9C6435A235D057F7D319AC83cb53'
  ]
  ]);
  proposalActions.targets.push(oracleAddress);
  proposalActions.values.push(ethers.BigNumber.from('0'));
  proposalActions.signatures.push('setAssetSources(address[],address[])');
  proposalActions.calldatas.push(oracleEncodedArguments);
  proposalActions.withDelegatecalls.push(false);
  

  //Encoding

  // This encodes the proposal call data for the base bridge executor
  proposalActions.encodedActions = ethers.utils.defaultAbiCoder.encode(
  ['address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]'],
  [
      proposalActions.targets,
      proposalActions.values,
      proposalActions.signatures,
      proposalActions.calldatas,
      proposalActions.withDelegatecalls,
  ]
  );

  // This encodes the proposal call data for the polygon bridge executor
  proposalActions.encodedRootCalldata = ethers.utils.defaultAbiCoder.encode(
  ['address', 'bytes'],
  [polygonBridgeExecutorAddress, proposalActions.encodedActions]
  );

  const AaveGovernanceV2 = await hre.ethers.getContractFactory(
    "AaveGovernanceV2"
  );
  aaveGovernanceV2 = await AaveGovernanceV2.attach(aaveGovernanceV2Address);
  // Make the proposal
  const proposal = await aaveGovernanceV2.connect(signer).create(
    shortExecutorAddress,
    [fxRootAddress], 
    [ethers.BigNumber.from('0')], 
    ['sendMessageToChild(address,bytes)'], 
    [proposalActions.encodedRootCalldata], 
    [false], 
    '0xf7a1f565fcd7684fba6fea5d77c5e699653e21cb6ae25fbf8c5dbc8d694c7949' //TODO: replace with correct IPFS hash
  );

  const proposalId = await aaveGovernanceV2.getProposalsCount() - 1;
  let proposalData = await aaveGovernanceV2.getProposalById(proposalId);

  console.log("Proposal ID: ", proposalId);
  
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
