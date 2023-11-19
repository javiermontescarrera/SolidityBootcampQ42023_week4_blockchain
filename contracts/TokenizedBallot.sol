// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }
    mapping(address => uint256) public voted;

    IMyToken public targetContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    constructor(
        bytes32[] memory _proposalNames,
        address _targetContract,
        uint256 _targetBlockNumber
    ) {
        targetContract = IMyToken(_targetContract);
        
        // Validate if targetBlockNumber is in the past
        require(
            _targetBlockNumber < block.number,
            "TokenizedBallot: targetBlockNumber must be in the past"
        );

        //end
        targetBlockNumber = _targetBlockNumber;
        // TODO: Validate if targetBlockNumber is in the past

        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    function getProposals() public view returns (bytes32[] memory){
        uint256 len = proposals.length;
        bytes32[] memory name = new bytes32[](len);
        // uint[] memory voteCount = new uint[](len);
        
        for (uint i = 0; i < len; i++) {
            Proposal storage prop = proposals[i];
            name[i] = prop.name;
            // voteCount[i] = prop.voteCount;
        }

        // return (name,voteCount);
        return (name);
    }

    function vote(uint256 proposal, uint256 amount) external {
        (
            uint256 availableVotingPower, 
            uint256 consumedVotingPower
        ) = getCurrentVotingPower(msg.sender);
        
        require(
            availableVotingPower >= amount,
            "TokenizedBallot: trying to vote more than allowed"
        );
        
        proposals[proposal].voteCount += amount;
        voted[msg.sender] = consumedVotingPower + amount;
    }

    function getCurrentVotingPower(address account) internal view returns (uint256, uint256) {
        uint256 consumedVotingPower = voted[account];
        uint256 availableVotingPower = targetContract.getPastVotes(account, targetBlockNumber) - consumedVotingPower;
        return ( availableVotingPower, consumedVotingPower );
    }

    function votingPower(address account) public view returns (uint256) {
        (uint256 availableVotingPower, ) = getCurrentVotingPower(account);
        return ( availableVotingPower );
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winningProposalVoteCount() public view returns (uint256 winningVoteCount_) {
        winningVoteCount_ = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount_) {
                winningVoteCount_ = proposals[p].voteCount;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
