import * as fs from "fs";
import { task } from "hardhat/config";
import { shortExecutorAddress, fxRootAddress, aaveGovernanceV2Address } from "../helpers/constants";
import { fillPolygonProposalActionsDelegateCall } from "../helpers/helpers";

task("sendProposal", "Send proposal").setAction(async (_, hre) => {
  const { ethers } = hre;
  //Remove this for the real thing.
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"],
  });

  //Set to the correct signer.
  const signer = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");

  let proposalActions = fillPolygonProposalActionsDelegateCall();
  let aaveGovernanceV2;

  // Make the proposal
  const AaveGovernanceV2 = await hre.ethers.getContractFactory("AaveGovernanceV2");
  aaveGovernanceV2 = await AaveGovernanceV2.attach(aaveGovernanceV2Address);
  const proposal = await aaveGovernanceV2.connect(signer).create(
    shortExecutorAddress,
    [fxRootAddress],
    [ethers.BigNumber.from("0")],
    ["sendMessageToChild(address,bytes)"],
    [proposalActions.encodedRootCalldata],
    [false],
    "0x04f0230984b6b2973cd7c5408910b643145f2ca35161ac0592c6ef024b593ff6", //TODO: replace with correct IPFS hash
    {gasPrice: 1000 * 1000 * 1000 * 180,
    gasLimit: 2000000}
  );

  const proposalId = (await aaveGovernanceV2.getProposalsCount()) - 1;
  const proposalHash = proposal.hash;

  if (hre.network.name == "mainnet") {
    console.log(`Proposal Created - ID:  ${proposalId}`);
    console.log(`Proposal Transaction Hash:  ${proposal.hash}`);
  }

  return proposalHash;
});
