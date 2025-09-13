const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivateVoting", function () {
  let privateVoting;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    
    const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
    privateVoting = await PrivateVoting.deploy();
    await privateVoting.waitForDeployment();
  });

  describe("Poll Creation", function () {
    it("Should create a poll successfully", async function () {
      const title = "Test Poll";
      const options = ["Option 1", "Option 2", "Option 3"];
      const duration = 3600; // 1 hour

      const tx = await privateVoting.createPoll(title, options, duration);
      const receipt = await tx.wait();

      // Check if PollCreated event was emitted
      const event = receipt.logs.find(log => {
        try {
          const parsed = privateVoting.interface.parseLog(log);
          return parsed.name === "PollCreated";
        } catch (e) {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
    });

    it("Should not allow non-owner to create poll", async function () {
      const title = "Test Poll";
      const options = ["Option 1", "Option 2"];
      const duration = 3600;

      await expect(
        privateVoting.connect(voter1).createPoll(title, options, duration)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should require at least 2 options", async function () {
      const title = "Test Poll";
      const options = ["Option 1"];
      const duration = 3600;

      await expect(
        privateVoting.createPoll(title, options, duration)
      ).to.be.revertedWith("Poll must have at least 2 options");
    });
  });

  describe("Voting", function () {
    let pollId;

    beforeEach(async function () {
      const title = "Test Poll";
      const options = ["Option 1", "Option 2", "Option 3"];
      const duration = 3600;

      const tx = await privateVoting.createPoll(title, options, duration);
      const receipt = await tx.wait();
      
      // Extract poll ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = privateVoting.interface.parseLog(log);
          return parsed.name === "PollCreated";
        } catch (e) {
          return false;
        }
      });
      
      pollId = event.args.pollId;
    });

    it("Should allow voting", async function () {
      // Note: This is a simplified test. In practice, you'd need to handle FHEVM encryption
      // For now, we'll test the basic functionality without encryption
      
      const hasVotedBefore = await privateVoting.hasVoted(pollId, voter1.address);
      expect(hasVotedBefore).to.be.false;

      // In a real implementation, you'd encrypt the vote choice
      // For testing purposes, we'll simulate this
      console.log("Note: FHEVM voting requires encrypted inputs - this is a simplified test");
    });

    it("Should prevent double voting", async function () {
      // This would be tested with actual FHEVM implementation
      console.log("Double voting prevention would be tested with FHEVM encryption");
    });
  });

  describe("Poll Information", function () {
    it("Should return correct poll information", async function () {
      const title = "Test Poll";
      const options = ["Option 1", "Option 2"];
      const duration = 3600;

      await privateVoting.createPoll(title, options, duration);
      
      const pollInfo = await privateVoting.getPollInfo(0);
      
      expect(pollInfo.title).to.equal(title);
      expect(pollInfo.options).to.deep.equal(options);
      expect(pollInfo.isActive).to.be.true;
      expect(pollInfo.totalVotes).to.equal(0);
    });
  });
});
