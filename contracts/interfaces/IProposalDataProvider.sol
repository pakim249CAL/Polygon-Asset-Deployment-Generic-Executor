// SPDX-License-Identifier: AGPL-3.0
// are we business license yet
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {IProposalGenericExecutor} from './IProposalGenericExecutor.sol';

interface IProposalDataProvider {
  function getPayload(uint256 id) external view returns (IProposalGenericExecutor.ProposalPayload memory);
}