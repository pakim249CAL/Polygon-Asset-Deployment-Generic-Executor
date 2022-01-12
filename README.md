# Polygon Asset Deployment Executor and Proposal Deployment Script

Contains scripts to deploy a proposal payload via the cross chain bridge to the Polygon AAVE market. 

AGPL

To use this respository for future assets, just make a new payload contract and change the deployer contract address in types.ts to the correct payload executor. Example in PolygonAssetDeploymentGenericExecutor.sol.


### Available commands:

`npm run hardhat sendProposal`

Run task to create a proposal in aave-governance-v2

`npm run sendProposalTest`

Create a proposal using the sendProposal task and test the proposal through execution

`npm run checkProposalOnPolygonTest`

Deploy a new PolygonDelegateCallExecutor, call the execute function, and confirm the aave market and oracles are updated successfully

`npm run end-to-end-test`

Run the sendProposaltest and save the crosschain data in a text file. Rune the checkProposalOnPolygonTest and use the data from the text file as the cross-chain data. The limitation of this test is you must use a contract that is already deployed on Polygon and have that address saved as the `deployerAddress`.
