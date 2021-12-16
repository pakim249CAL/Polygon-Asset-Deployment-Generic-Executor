# Polygon Asset Deployment Executor and Proposal Deployment Script

Contains scripts to deploy a proposal payload via the cross chain bridge to the Polygon AAVE market. 

PolygonAssetListingProposalGenericExecutor is meant to be delegate called to add an asset to the Polygon market. deploy.js deploys this executor. An executor is already deployed and being used in sendProposal.js.

sendProposal.js creates and sends the necessary payloads to the AAVE V2 Governance contract.

Output.txt is the bytes data from the StateSynced event of FxRoot which emulates the data that would be sent to FxChild, which would then decode and submit that data to the executor. Output.txt is created by sendProposalTest.js which is meant to be run in a Ethereum mainnet fork. checkProposalOnPolygon.js is meant to be run on a Polygon mainnet fork after sendProposalTest.js is run.
