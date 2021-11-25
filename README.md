# Polygon Asset Deployment Executor and Proposal Deployment Script

Contains scripts to deploy a proposal payload via the cross chain bridge to the Polygon AAVE market. 

PolygonAssetListingProposalGenericExecutor is meant to be delegate called to add an asset to the Polygon market. deploy.js deploys this executor. 

sendProposal.js creates and sends the necessary payloads to the AAVE V2 Governance contract.
