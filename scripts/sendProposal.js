const hre = require("hardhat");
const ethers = require("ethers");

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

  //Remove this for the real thing
  const signer = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");

  const proposalActions = new ProposalActions();
  const polygonBridgeExecutorAddress = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772';
  const polygonAssetDeployerAddress = '0x6123fD450AaA6086c5e172657379E367B4301548';
  const polygonLendingPoolConfiguratorAddress = '0x26db2B833021583566323E3b8985999981b9F1F3';
  const shortExecutorAddress = '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5';
  const fxRootAddress = '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2';
  const oracleAddress = '0x0229F777B0fAb107F9591a41d5F02E4e98dB6f2d'; // Polygon AAVE Oracle Address
  const aTokenAddress = '0x3cb4ca3c9dc0e02d252098eebb3871ac7a43c54d'; 
  const stableDebtAddress = '0x72a053fa208eaafa53adb1a1ea6b4b2175b5735e';
  const variableDebtAddress = '0x1d22ae684f479d3da97ca19ffb03e6349d345f24';

  const AaveGovernanceV2 = await hre.ethers.getContractFactory(
    "AaveGovernanceV2"
  );
  const aaveGovernanceV2 = await AaveGovernanceV2.attach('0xEC568fffba86c094cf06b22134B23074DFE2252c');


  const createAssetAbiParameters = [
    'address', //token
    'address', //aToken
    'address', //stableDebtToken
    'address', //variableDebtToken
    'address', //interestStrategy
    'uint256', //ltv
    'uint256', //lt
    'uint256', //lb
    'uint256', //rf
    'uint8', //decimals
    'bool', //enableBorrow
    'bool', //enableStableBorrow
    'bool' //enableAsCollateral
  ];

  const ghstParameters = [
    '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
    aTokenAddress,
    stableDebtAddress,
    variableDebtAddress,
    '0xBb480ae4e2cf28FBE80C9b61ab075f6e7C4dB468',
    ethers.BigNumber.from('2500'),
    ethers.BigNumber.from('4500'),
    ethers.BigNumber.from('12500'),
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('18'),
    true,
    false,
    true
  ];

  const balParameters = [
    '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
    aTokenAddress,
    stableDebtAddress,
    variableDebtAddress,
    '0x9025C2d672afA29f43cB59b3035CaCfC401F5D62',
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('4500'),
    ethers.BigNumber.from('10000'),
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('18'),
    true,
    false,
    true
  ];
  
  const dpiParameters = [
    '0x85955046df4668e1dd369d2de9f3aeb98dd2a369',
    aTokenAddress,
    stableDebtAddress,
    variableDebtAddress,
    '0x6405F880E431403588e92b241Ca15603047ef8a4',
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('4500'),
    ethers.BigNumber.from('10000'),
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('18'),
    false,
    false,
    true
  ];

  const crvParameters = [
    '0x172370d5cd63279efa6d502dab29171933a610af',
    aTokenAddress,
    stableDebtAddress,
    variableDebtAddress,
    '0xBD67eB7e00f43DAe9e3d51f7d509d4730Fe5988e',
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('4500'),
    ethers.BigNumber.from('10000'),
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('18'),
    true,
    false,
    true
  ];

  const sushiParameters = [
    '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
    aTokenAddress,
    stableDebtAddress,
    variableDebtAddress,
    '0x835699Bf98f6a7fDe5713c42c118Fb80fA059737',
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('4500'),
    ethers.BigNumber.from('10000'),
    ethers.BigNumber.from('2000'),
    ethers.BigNumber.from('18'),
    false,
    false,
    true
  ];

  const linkParameters = [
    '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    aTokenAddress,
    stableDebtAddress,
    variableDebtAddress,
    '0x5641Bb58f4a92188A6F16eE79C8886Cf42C561d3',
    ethers.BigNumber.from('5000'),
    ethers.BigNumber.from('6500'),
    ethers.BigNumber.from('7500'),
    ethers.BigNumber.from('1000'),
    ethers.BigNumber.from('18'),
    true,
    false,
    true
  ];

  // Bridge Executor calls the polygon asset deployer executor with delegate call with the arguments above
  // Delegate call is necessary to have one contract call fulfill all the asset deployment responsibilities reliably
  function addAssetAction(parameters) {
    const encodedArguments = ethers.utils.defaultAbiCoder.encode(createAssetAbiParameters, parameters);
    proposalActions.targets.push(polygonAssetDeployerAddress);
    proposalActions.values.push(ethers.BigNumber.from('0'));
    proposalActions.signatures.push('execute(address,address,address,address,address,uint256,uint256,uint256,uint256,uint8,bool,bool,bool)');
    proposalActions.calldatas.push(encodedArguments);
    proposalActions.withDelegatecalls.push(true);
  }

  addAssetAction(ghstParameters);
  addAssetAction(balParameters);
  addAssetAction(dpiParameters);
  addAssetAction(crvParameters);
  addAssetAction(sushiParameters);
  addAssetAction(linkParameters);

  //Add oracles for all new assets
  const oracleEncodedArguments = ethers.utils.defaultAbiCoder.encode([
    'address[]', //assets
    'address[]' //oracles
  ], [
    [
      ghstParameters[0],
      balParameters[0],
      dpiParameters[0],
      crvParameters[0],
      sushiParameters[0],
      linkParameters[0]
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

  //WMATIC Risk Parameter Change

  const maticEncodedArguments = ethers.utils.defaultAbiCoder.encode(
    [
      'address', //Asset
      'uint256', //LTV
      'uint256', //LT
      'uint256'], //LB
    [
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      ethers.BigNumber.from('6500'),
      ethers.BigNumber.from('7000'),
      ethers.BigNumber.from('11000')
    ]);
  proposalActions.targets.push(polygonLendingPoolConfiguratorAddress);
  proposalActions.values.push(ethers.BigNumber.from('0'));
  proposalActions.signatures.push('configureReserveAsCollateral(address,uint256,uint256,uint256)');
  proposalActions.calldatas.push(maticEncodedArguments);
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

  /* This sends the actual proposal to the AAVE V2 Governance contract on Ethereum.
   * Upon the proposal passing and queued, the executor will call sendMessageToChild
   * on FxRoot with the twice encoded call data.
  */ 
  const tx = await aaveGovernanceV2.connect(signer).callStatic.create( //remove connect().callStatic for the real thing. Just there for testing purposes
    shortExecutorAddress,
    [fxRootAddress], 
    [ethers.BigNumber.from(0)], 
    ['sendMessageToChild(address,bytes)'], 
    [proposalActions.encodedRootCalldata], 
    [false], 
    '0xf7a1f565fcd7684fba6fea5d77c5e699653e21cb6ae25fbf8c5dbc8d694c7949' //TODO: replace with correct IPFS hash
  );
  console.log(tx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
