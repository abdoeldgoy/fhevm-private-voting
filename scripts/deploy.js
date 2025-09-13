const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PrivateVoting contract...");

  // Get the contract factory
  const PrivateVoting = await ethers.getContractFactory("PrivateVoting");

  // Deploy the contract
  const privateVoting = await PrivateVoting.deploy();

  // Wait for deployment to complete
  await privateVoting.waitForDeployment();

  const contractAddress = await privateVoting.getAddress();
  
  console.log("PrivateVoting deployed to:", contractAddress);
  console.log("Contract owner:", await privateVoting.owner());
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    timestamp: new Date().toISOString(),
    owner: await privateVoting.owner()
  };
  
  fs.writeFileSync(
    './deployment.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
