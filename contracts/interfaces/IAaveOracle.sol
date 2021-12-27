// SPDX-License-Identifier: MIT
import "./IOwnable.sol";

pragma solidity ^0.6.12;

interface IAaveOracle is IOwnable {
    function getSourceOfAsset(address _asset) external view returns (address);
    function getAssetPrice(address _asset) external view returns (uint256);
}
