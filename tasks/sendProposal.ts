import { task } from "hardhat/config";
import { shortExecutorAddress, fxRootAddress, aaveGovernanceV2Address } from "../helpers/types";
import {
  fillPolygonProposalActions,
  fillPolygonProposalActionsDelegateCall,
} from "../helpers/helpers";

task("sendProposal", "Send proposal").setAction(async (_, hre) => {
  const ethers = hre.ethers;

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
    "0xf7a1f565fcd7684fba6fea5d77c5e699653e21cb6ae25fbf8c5dbc8d694c7949" //TODO: replace with correct IPFS hash
  );

  const proposalId = (await aaveGovernanceV2.getProposalsCount()) - 1;

  if (hre.network.name == "mainnet") {
    console.log(`Proposal Created - ID:  ${proposalId}`);
    console.log(`Proposal Transaction Hash:  ${proposal.hash}`);
  }

  return proposal.hash;
});
