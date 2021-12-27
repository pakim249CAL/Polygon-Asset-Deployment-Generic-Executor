import * as hre from "hardhat";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

import { 
  ProposalStates,
  shortExecutorAddress,
  fxRootAddress,
  aaveGovernanceV2Address,
} from "../helpers/types";
import {
  fillPolygonProposalActions,
  fillPolygonProposalActionsDelegateCall,
} from "../helpers/helpers";


describe("Proposal Test", function () {

  let whale1: Signer;
  let whale2: Signer;
  let whale3: Signer;
  let whale4: Signer;
  let proposalActions = fillPolygonProposalActionsDelegateCall('0x2CE7f32755181f32bAfB65286aedB24fdd723E75');
  let aaveGovernanceV2: any;

  before(async function() {
    // Harpooning some whales
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

    await hre.network.provider.send("hardhat_setBalance", [
      await whale1.getAddress(),
      '0x8AC7230489E80000',
    ]);
    await hre.network.provider.send("hardhat_setBalance", [
      await whale2.getAddress(),
      '0x8AC7230489E80000',
    ]);
    await hre.network.provider.send("hardhat_setBalance", [
      await whale3.getAddress(),
      '0x8AC7230489E80000',
    ]);
    await hre.network.provider.send("hardhat_setBalance", [
      await whale4.getAddress(),
      '0x8AC7230489E80000',
    ]);
    const AaveGovernanceV2 = await hre.ethers.getContractFactory(
      "AaveGovernanceV2"
    );
    aaveGovernanceV2 = await AaveGovernanceV2.attach(aaveGovernanceV2Address);
  });

  it("Should put up the proposal and trigger state sender", async function() {
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
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.PENDING);
    await aaveGovernanceV2.connect(whale1).submitVote(proposalId, true);
    await aaveGovernanceV2.connect(whale2).submitVote(proposalId, true);
    await aaveGovernanceV2.connect(whale3).submitVote(proposalId, true);
    await aaveGovernanceV2.connect(whale4).submitVote(proposalId, true);
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.ACTIVE);
    //Queue proposal
    //Voting period is 19200 blocks for short executor
    for (let i = 0; i < 19201; i++) {
      await hre.network.provider.send('evm_mine', []);
    }
    await aaveGovernanceV2.queue(proposalId);
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.QUEUED);

    //Execute proposal
    //Execution timelock is 86400
    await hre.network.provider.send('evm_increaseTime', [86401]);
    const executionTx = await aaveGovernanceV2.execute(proposalId);
    const receipt = await hre.network.provider.send("eth_getTransactionReceipt", [executionTx.hash]);
    const stateSenderInterface = new ethers.utils.Interface(["event StateSynced(uint256 indexed id, address indexed contractAddress, bytes data)"]);
    const data = receipt.logs[0].data;
    const topics = receipt.logs[0].topics;
    const event = stateSenderInterface.decodeEventLog("StateSynced", data, topics);
    expect(event.data).to.equal(proposalActions.stateSenderData);
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.EXECUTED);

  });
});