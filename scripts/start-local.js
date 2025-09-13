const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting FHEVM Private Voting dApp...\n');

// Start Hardhat node
console.log('📡 Starting Hardhat local node...');
const hardhat = spawn('npx', ['hardhat', 'node'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

// Wait a bit for Hardhat to start
setTimeout(() => {
  console.log('\n🔧 Deploying contracts...');
  const deploy = spawn('npx', ['hardhat', 'run', 'scripts/deploy.js', '--network', 'localhost'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });

  deploy.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Contracts deployed successfully!');
      console.log('\n🌐 Starting frontend...');
      
      // Start Next.js frontend
      const frontend = spawn('npm', ['run', 'dev'], {
        cwd: path.join(__dirname, '..', 'frontend'),
        stdio: 'inherit'
      });

      frontend.on('close', (code) => {
        console.log(`\nFrontend exited with code ${code}`);
        process.exit(code);
      });
    } else {
      console.log(`\n❌ Contract deployment failed with code ${code}`);
      process.exit(code);
    }
  });
}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  hardhat.kill();
  process.exit(0);
});
