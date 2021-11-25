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
  await hre.network.provider.request({
  method: "hardhat_impersonateAccount",
  params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"],
  });

  const signer = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");

  const proposalActions = new ProposalActions();
  const polygonBridgeExecutorAddress = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772';
  const polygonAssetDeployerAddress = '0x6123fD450AaA6086c5e172657379E367B4301548';
  const polygonLendingPoolConfiguratorAddress = '0x26db2B833021583566323E3b8985999981b9F1F3';
  const shortExecutorAddress = '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5';
  const fxRootAddress = '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2';
  const AaveGovernanceV2 = await hre.ethers.getContractFactory(
    "AaveGovernanceV2"
  );
  const aaveGovernanceV2 = await AaveGovernanceV2.attach('0xEC568fffba86c094cf06b22134B23074DFE2252c');
  const abiParameters = [
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
    '0x134aBc1dfA88AD5a9a0E6E8A20D04214cd7D34f3',
    '0xd96b11d49798413AB2Bdf07e2FBF31c4154EB6Cd',
    '0xe0410E531499Ef3EFe1054316a9624BAA0EBe78a',
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
    '0xcD6cFf8248082De7258C4fdc92246B127A31875E',
    '0x4530609c137552D6b98223377FeAcc37e2095652',
    '0x829628639E10FD7A4C1bf573e02baE94AB12A401',
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
    '0x1a695110c0eEd0caec3Ce9e1B10F77DD250d0bC3',
    '0x69a5c7b4E3209233B3208096b660E628b24d17D2',
    '0x71A5ad03BbCf848E84C09BA9E392f9a65f76eeCd',
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
    '0x92cDdC0cB2103d7551707eE51a3a446B99944D19',
    '0x094c377b8c3d8261e54aAEfBC500dffA1Cc6df22',
    '0x3031BDD5CDc9F958A6513Be6BFEcD49fcF518408',
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
    '0x0c9D3023A2D9E4F9712e595cefE11c4eC56Fc77e',
    '0xbf48791522AF263c2141E8D19a965EA932274Fa6',
    '0x3a6917c196d8C885eB2f702532Ec6b9B24EFD071',
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
    '0xD0F231A80aa76757232e3cd17e75F14426a2acC2',
    '0xD51719FDf9780FEe8d0Ff3A75aba15Fd19855309',
    '0xA8100Ad31769302217ce96f03feE46dD4b3cc335',
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

  function addAssetAction(parameters) {
    const encodedArguments = ethers.utils.defaultAbiCoder.encode(abiParameters, parameters);
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

  //WMATIC Risk Parameter Change

  const encodedArguments = ethers.utils.defaultAbiCoder.encode(
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
  proposalActions.calldatas.push(encodedArguments);
  proposalActions.withDelegatecalls.push(false);

  //Encoding

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

  proposalActions.encodedRootCalldata = ethers.utils.defaultAbiCoder.encode(
    ['address', 'bytes'],
    [polygonBridgeExecutorAddress, proposalActions.encodedActions]
  );

  //Send transaction. Logs proposal id.
  const tx = await aaveGovernanceV2.connect(signer).callStatic.create( //remove callStatic for the real thing
    shortExecutorAddress, 
    [fxRootAddress], 
    [ethers.BigNumber.from(0)], 
    ['sendMessageToChild(address,bytes)'], 
    [proposalActions.encodedRootCalldata], 
    [false], 
    '0xf7a1f565fcd7684fba6fea5d77c5e699653e21cb6ae25fbf8c5dbc8d694c7949' //TODO: replace with correct IPFS hash
  )
  console.log(tx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
