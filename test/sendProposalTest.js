const hre = require("hardhat");
const ethers = require("ethers");
const { expect } = require("chai");
const fs = require('fs')
const {
  expectEvent,
  expectRevert,
  time,
} = require("@openzeppelin/test-helpers");

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
const proposalStates = {
    PENDING: 0,
    CANCELED: 1,
    ACTIVE: 2,
    FAILED: 3,
    SUCCEEDED: 4,
    QUEUED: 5,
    EXPIRED: 6,
    EXECUTED: 7,
  };


describe("Send Proposal", function() {
    let whale1;
    let whale2;
    let whale3;
    let whale4;
    let proposalActions = new ProposalActions();
    let aaveGovernanceV2;
    let stateSender;
    const polygonBridgeExecutorAddress = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772';
    const polygonAssetDeployerAddress = '0x0e78a732F80D462101Aea044CF55D714c6227d77';
    const polygonLendingPoolConfiguratorAddress = '0x26db2B833021583566323E3b8985999981b9F1F3';
    const shortExecutorAddress = '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5';
    const fxRootAddress = '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2';
    const oracleAddress = '0x0229F777B0fAb107F9591a41d5F02E4e98dB6f2d'; // Polygon AAVE Oracle Address
    const aTokenAddress = '0x3cb4ca3c9dc0e02d252098eebb3871ac7a43c54d'; 
    const stableDebtAddress = '0x72a053fa208eaafa53adb1a1ea6b4b2175b5735e';
    const variableDebtAddress = '0x1d22ae684f479d3da97ca19ffb03e6349d345f24';
    const aaveGovernanceV2Address = '0xEC568fffba86c094cf06b22134B23074DFE2252c';
    const stateSenderAddress = '0x28e4F3a7f651294B9564800b2D01f35189A5bFbE';
    const treasuryAddress = '0x7734280A4337F37Fbf4651073Db7c28C80B339e9';
    const incentivesControllerAddress = '0x357D51124f59836DeD84c8a1730D72B749d8BC23';
    const ghstAddress = '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7'
    const junkParams = '0x00'; //this is not used
    /*
    const createAssetAbiParameters = [
        'address', //atoken
        'address', //stableDebtToken
        'address', //variableDebtToken
        'uint8', //underlying decimals
        'address', //interestStrategy
        'address', //underlying asset
        'address', //treasury
        'address', //incentives controller
        'string', //underlyingAssetName
        'string', //aTokenName
        'string', //aTokenSymbol
        'string', //variableDebtTokenName
        'string', //variableDebtTokenSymbol
        'string', //stableDebtTokenName
        'string', //stableDebtTokenSymbol
        'bytes' //params
    ];*/
    const createAssetAbiParameters = [
        "tuple(address,address,address,address,address,uint256,uint256,uint256,uint256,uint8,bool,bool,bool,string,string,string,string,string,string,string,bytes)"
    ]
    
    const ghstParametersCreation = [[
        ghstAddress,
        aTokenAddress,
        stableDebtAddress,
        variableDebtAddress,
        '0xBb480ae4e2cf28FBE80C9b61ab075f6e7C4dB468',
        2500,
        4500,
        12500,
        2000,
        18,
        true,
        false,
        true,
        "GHST",
        "Aave Matic Market GHST",
        "amGHST",
        "Aave Matic Market variable debt GHST",
        "variableDebtmGHST",
        "Aave Matic Market stable debt GHST",
        "stableDebtmGHST",
        junkParams,
    ]];


    /*
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
    */


    before(async function() {
        //This impersonates an account with enough AAVE to make a proposal.
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"], 
        });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0x4da27a545c0c5b758a6ba100e3a049001de870f5"],
        });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0xdD709cAE362972cb3B92DCeaD77127f7b8D58202"],
        });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0x4a49985B14bD0ce42c25eFde5d8c379a48AB02F3"],
        });
    
        whale1 = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");
        whale2 = await hre.ethers.getSigner("0x4da27a545c0c5b758a6ba100e3a049001de870f5");
        whale3 = await hre.ethers.getSigner("0xdD709cAE362972cb3B92DCeaD77127f7b8D58202");
        whale4 = await hre.ethers.getSigner("0x4a49985B14bD0ce42c25eFde5d8c379a48AB02F3");
    
        const AaveGovernanceV2 = await hre.ethers.getContractFactory(
            "AaveGovernanceV2"
        );
        aaveGovernanceV2 = await AaveGovernanceV2.attach(aaveGovernanceV2Address);

        const StateSender = await hre.ethers.getContractFactory(
            "StateSender"
        );
        stateSender = await StateSender.attach(stateSenderAddress);
    
        function addAssetAction(creationParams) {
            const encodedArguments = ethers.utils.defaultAbiCoder.encode(createAssetAbiParameters, creationParams);
            proposalActions.targets.push(polygonAssetDeployerAddress);
            proposalActions.values.push(ethers.BigNumber.from('0'));
            proposalActions.signatures.push('execute(' + createAssetAbiParameters + ')');
            proposalActions.calldatas.push(encodedArguments);
            proposalActions.withDelegatecalls.push(true);

        }
        
        addAssetAction(ghstParametersCreation);/*
        addAssetAction(balParameters);
        addAssetAction(dpiParameters);
        addAssetAction(crvParameters);
        addAssetAction(sushiParameters);
        addAssetAction(linkParameters);*/
        

        /* Cannot test for this until ownership of oracle is transferred
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
        */

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
    

    });

    describe("Send Proposal", function() {
        it("Should be able to send proposal", async function() {
            // Make the proposal
            const proposal = await aaveGovernanceV2.connect(whale1).create(
                shortExecutorAddress,
                [fxRootAddress], 
                [ethers.BigNumber.from('0')], 
                ['sendMessageToChild(address,bytes)'], 
                [proposalActions.encodedRootCalldata], 
                [false], 
                '0xf7a1f565fcd7684fba6fea5d77c5e699653e21cb6ae25fbf8c5dbc8d694c7949' //TODO: replace with correct IPFS hash
            );
            const proposalId = await aaveGovernanceV2.getProposalsCount() - 1;
            expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(proposalStates.PENDING);
            
            // Trigger votes
            await network.provider.send("hardhat_setBalance", [
                whale1.address,
                '0x8AC7230489E80000',
            ]);
            await network.provider.send("hardhat_setBalance", [
                whale2.address,
                '0x8AC7230489E80000',
            ]);
            await network.provider.send("hardhat_setBalance", [
                whale3.address,
                '0x8AC7230489E80000',
            ]);
            await network.provider.send("hardhat_setBalance", [
                whale4.address,
                '0x8AC7230489E80000',
            ]);
              
            await aaveGovernanceV2.connect(whale1).submitVote(proposalId, true);
            await aaveGovernanceV2.connect(whale2).submitVote(proposalId, true);
            await aaveGovernanceV2.connect(whale3).submitVote(proposalId, true);
            await aaveGovernanceV2.connect(whale4).submitVote(proposalId, true);
            expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(proposalStates.ACTIVE);

            //Queue proposal
            //Voting period is 19200 blocks for short executor
            for (let i = 0; i < 19201; i++) {
                await hre.network.provider.send('evm_mine', []);
            }
            await aaveGovernanceV2.queue(proposalId);
            expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(proposalStates.QUEUED);

            //Execute proposal
            //Execution timelock is 86400
            await hre.network.provider.send('evm_increaseTime', [86401]);
            const executionTx = await aaveGovernanceV2.execute(proposalId);
            const receipt = await hre.network.provider.send("eth_getTransactionReceipt", [executionTx.hash]);
            const interface = new ethers.utils.Interface(["event StateSynced(uint256 indexed id, address indexed contractAddress, bytes data)"]);
            const data = receipt.logs[0].data;
            const topics = receipt.logs[0].topics;
            const event = interface.decodeEventLog("StateSynced", data, topics);
            fs.writeFile('Output.txt', event.data, (err) => {
                if (err) throw err;
                console.log('Data sent through FxRoot saved to Output.txt');
            });
            expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(proposalStates.EXECUTED);

        });
    });
});
