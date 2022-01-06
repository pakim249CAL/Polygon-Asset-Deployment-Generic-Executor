require("dotenv").config();
import * as hre from "hardhat";
import { DRE } from "../helpers/misc-utils";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { BigNumber } from "ethers";
import { expect } from "chai";

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
  let proposalActions = fillPolygonProposalActionsDelegateCall();
  let aaveGovernanceV2: any;

  let proposalId: BigNumber;

  before(async function () {
    await hre.run("set-DRE");
    // Harpooning some whales
    await DRE.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"],
    });
    await DRE.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x4da27a545c0c5b758a6ba100e3a049001de870f5"],
    });
    await DRE.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xdD709cAE362972cb3B92DCeaD77127f7b8D58202"],
    });
    await DRE.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x4a49985B14bD0ce42c25eFde5d8c379a48AB02F3"],
    });
    whale1 = await DRE.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");
    whale2 = await DRE.ethers.getSigner("0x4da27a545c0c5b758a6ba100e3a049001de870f5");
    whale3 = await DRE.ethers.getSigner("0xdD709cAE362972cb3B92DCeaD77127f7b8D58202");
    whale4 = await DRE.ethers.getSigner("0x4a49985B14bD0ce42c25eFde5d8c379a48AB02F3");

    await DRE.network.provider.send("hardhat_setBalance", [
      await whale1.getAddress(),
      "0x8AC7230489E80000",
    ]);
    await DRE.network.provider.send("hardhat_setBalance", [
      await whale2.getAddress(),
      "0x8AC7230489E80000",
    ]);
    await DRE.network.provider.send("hardhat_setBalance", [
      await whale3.getAddress(),
      "0x8AC7230489E80000",
    ]);
    await DRE.network.provider.send("hardhat_setBalance", [
      await whale4.getAddress(),
      "0x8AC7230489E80000",
    ]);
    const AaveGovernanceV2 = await DRE.ethers.getContractFactory("AaveGovernanceV2");
    aaveGovernanceV2 = await AaveGovernanceV2.attach(aaveGovernanceV2Address);
  });

  it("Create proposal", async () => {
    let proposalTransactionHash = await DRE.run("sendProposal");

    const proposalTransactionReceipt = await DRE.ethers.provider.getTransactionReceipt(
      proposalTransactionHash
    );
    const proposalCreatedEvent = aaveGovernanceV2.interface.parseLog(
      proposalTransactionReceipt.logs[0]
    );

    proposalId = proposalCreatedEvent.args.id;

    expect(proposalCreatedEvent.name).to.equal("ProposalCreated");

    const targets = proposalCreatedEvent.args.targets;
    expect(targets.length).to.eq(1);
    expect(targets[0]).to.eq(fxRootAddress);

    // colission with the name values. values is the 4th arg in the `ProposalCreated` event
    const values = proposalCreatedEvent.args[4];
    expect(values.length).to.eq(1);
    expect(values[0]).to.eq(0);

    const signatures = proposalCreatedEvent.args.signatures;
    expect(signatures.length).to.eq(1);
    expect(signatures[0]).to.eq("sendMessageToChild(address,bytes)");

    const calldatas = proposalCreatedEvent.args.calldatas;
    expect(calldatas.length).to.eq(1);

    const withDelegatecalls = proposalCreatedEvent.args.withDelegatecalls;
    expect(withDelegatecalls.length).to.eq(1);
    expect(withDelegatecalls[0]).to.be.false;
  });

  it("Vote on proposal", async () => {
    const proposalId = (await aaveGovernanceV2.getProposalsCount()) - 1;
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.PENDING);
    await aaveGovernanceV2.connect(whale1).submitVote(proposalId, true);
    await aaveGovernanceV2.connect(whale2).submitVote(proposalId, true);
    await aaveGovernanceV2.connect(whale3).submitVote(proposalId, true);
    await aaveGovernanceV2.connect(whale4).submitVote(proposalId, true);
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.ACTIVE);
  });

  it("Queue proposal", async () => {
    //Queue proposal
    //Voting period is 19200 blocks for short executor
    for (let i = 0; i < 19201; i++) {
      await DRE.network.provider.send("evm_mine", []);
    }
    await aaveGovernanceV2.queue(proposalId);
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.QUEUED);
  });

  it("Queue proposal", async () => {
    //Execute proposal
    //Execution timelock is 86400
    await DRE.network.provider.send("evm_increaseTime", [86401]);
    const executionTx = await aaveGovernanceV2.execute(proposalId);
    const receipt = await DRE.network.provider.send("eth_getTransactionReceipt", [
      executionTx.hash,
    ]);
    const stateSenderInterface = new ethers.utils.Interface([
      "event StateSynced(uint256 indexed id, address indexed contractAddress, bytes data)",
    ]);
    const data = receipt.logs[0].data;
    const topics = receipt.logs[0].topics;
    const event = stateSenderInterface.decodeEventLog("StateSynced", data, topics);
    expect(event.data).to.equal(proposalActions.stateSenderData);
    expect(await aaveGovernanceV2.getProposalState(proposalId)).to.equal(ProposalStates.EXECUTED);
  });
});
