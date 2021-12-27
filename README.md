# Polygon Asset Deployment Executor and Proposal Deployment Script

Contains scripts to deploy a proposal payload via the cross chain bridge to the Polygon AAVE market. 

AGPL

To use this respository for future assets, just make a new payload contract and change the deployer contract address in types.ts to the correct payload executor. Example in PolygonAssetDeploymentGenericExecutor.sol.

The data provider contract simply immutably stores the payload structs since structs cannot be stored as constants yet, and the payload contract must be delegate called so there can be no storage in that contract.
