// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@fhevm/lib/FHE.sol";
import "@fhevm/lib/Reencrypt.sol";

/**
 * @title PrivateVoting
 * @dev A privacy-preserving voting system using FHEVM
 * @author Zama Builder Track Submission
 */
contract PrivateVoting {
    
    // Events
    event PollCreated(uint256 pollId, string title, string[] options, uint256 endTime);
    event VoteCast(uint256 pollId, address voter);
    event PollEnded(uint256 pollId, uint256[] results);
    
    // Structs
    struct Poll {
        string title;
        string[] options;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
        mapping(uint256 => euint32) encryptedVotes; // Encrypted vote counts per option
        mapping(address => bool) hasVoted;
    }
    
    // State variables
    mapping(uint256 => Poll) public polls;
    uint256 public nextPollId;
    address public owner;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier pollExists(uint256 _pollId) {
        require(_pollId < nextPollId, "Poll does not exist");
        _;
    }
    
    modifier pollActive(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        require(block.timestamp < polls[_pollId].endTime, "Poll has ended");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new voting poll
     * @param _title Title of the poll
     * @param _options Array of voting options
     * @param _duration Duration of the poll in seconds
     */
    function createPoll(
        string memory _title,
        string[] memory _options,
        uint256 _duration
    ) external onlyOwner returns (uint256) {
        require(_options.length > 1, "Poll must have at least 2 options");
        require(_duration > 0, "Duration must be positive");
        
        uint256 pollId = nextPollId++;
        Poll storage poll = polls[pollId];
        
        poll.title = _title;
        poll.endTime = block.timestamp + _duration;
        poll.isActive = true;
        
        // Initialize encrypted vote counts to zero
        for (uint256 i = 0; i < _options.length; i++) {
            poll.options.push(_options[i]);
            poll.encryptedVotes[i] = FHE.asEuint32(0);
        }
        
        emit PollCreated(pollId, _title, _options, poll.endTime);
        return pollId;
    }
    
    /**
     * @dev Cast a vote (encrypted)
     * @param _pollId ID of the poll
     * @param _optionIndex Index of the chosen option (encrypted)
     */
    function castVote(
        uint256 _pollId,
        euint32 _optionIndex
    ) external pollExists(_pollId) pollActive(_pollId) {
        Poll storage poll = polls[_pollId];
        require(!poll.hasVoted[msg.sender], "Already voted");
        
        // Mark as voted
        poll.hasVoted[msg.sender] = true;
        poll.totalVotes++;
        
        // Add encrypted vote to the chosen option
        // This is a simplified version - in practice, you'd use more sophisticated FHE operations
        for (uint256 i = 0; i < poll.options.length; i++) {
            euint32 isSelected = FHE.eq(_optionIndex, FHE.asEuint32(i));
            poll.encryptedVotes[i] = FHE.add(poll.encryptedVotes[i], isSelected);
        }
        
        emit VoteCast(_pollId, msg.sender);
    }
    
    /**
     * @dev End a poll and reveal results
     * @param _pollId ID of the poll to end
     */
    function endPoll(uint256 _pollId) external pollExists(_pollId) {
        Poll storage poll = polls[_pollId];
        require(poll.isActive, "Poll already ended");
        require(block.timestamp >= poll.endTime, "Poll has not ended yet");
        
        poll.isActive = false;
        
        // Decrypt and reveal results
        uint256[] memory results = new uint256[](poll.options.length);
        for (uint256 i = 0; i < poll.options.length; i++) {
            results[i] = FHE.decrypt(poll.encryptedVotes[i]);
        }
        
        emit PollEnded(_pollId, results);
    }
    
    /**
     * @dev Get poll information
     * @param _pollId ID of the poll
     */
    function getPollInfo(uint256 _pollId) 
        external 
        view 
        pollExists(_pollId) 
        returns (
            string memory title,
            string[] memory options,
            uint256 endTime,
            bool isActive,
            uint256 totalVotes
        ) 
    {
        Poll storage poll = polls[_pollId];
        return (
            poll.title,
            poll.options,
            poll.endTime,
            poll.isActive,
            poll.totalVotes
        );
    }
    
    /**
     * @dev Check if an address has voted in a poll
     * @param _pollId ID of the poll
     * @param _voter Address to check
     */
    function hasVoted(uint256 _pollId, address _voter) 
        external 
        view 
        pollExists(_pollId) 
        returns (bool) 
    {
        return polls[_pollId].hasVoted[_voter];
    }
    
    /**
     * @dev Get encrypted vote count for an option (for verification)
     * @param _pollId ID of the poll
     * @param _optionIndex Index of the option
     */
    function getEncryptedVoteCount(uint256 _pollId, uint256 _optionIndex) 
        external 
        view 
        pollExists(_pollId) 
        returns (euint32) 
    {
        require(_optionIndex < polls[_pollId].options.length, "Invalid option index");
        return polls[_pollId].encryptedVotes[_optionIndex];
    }
}
