# Deployment Guide

This guide will help you deploy the FHEVM Private Voting dApp.

## Prerequisites

- Node.js 18+ installed
- Git installed
- A wallet with testnet ETH (for deployment)

## Local Development Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Start Local Development

```bash
# Start everything (Hardhat node + contracts + frontend)
node scripts/start-local.js
```

This will:
- Start a local Hardhat node
- Deploy contracts to local network
- Start the Next.js frontend on http://localhost:3000

### 3. Manual Setup (Alternative)

If you prefer to run components separately:

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start frontend
cd frontend
npm run dev
```

## Production Deployment

### 1. Deploy Smart Contracts

#### To FHEVM Testnet (when available)

```bash
# Set up environment variables
export PRIVATE_KEY=your_private_key_here
export FHEVM_RPC_URL=https://testnet.fhevm.io

# Deploy to FHEVM testnet
npx hardhat run scripts/deploy.js --network fhevmTestnet
```

#### To Other Networks

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet (be careful!)
npx hardhat run scripts/deploy.js --network mainnet
```

### 2. Deploy Frontend

#### Using Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your deployed contract address
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID

#### Using Netlify

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `out` folder to Netlify

#### Using IPFS

1. Build the frontend:
```bash
cd frontend
npm run build
npm run export
```

2. Upload the `out` folder to IPFS using services like Pinata

## Environment Variables

Create a `.env` file in the frontend directory:

```env
# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_RPC_URL=http://localhost:8545
```

## Verification

### Verify Smart Contract

```bash
# Verify on Etherscan (for supported networks)
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Test the Application

1. Connect your wallet to the deployed frontend
2. Create a test poll
3. Cast votes from different addresses
4. End the poll and verify results

## Troubleshooting

### Common Issues

1. **Contract deployment fails**: Check your private key and RPC URL
2. **Frontend can't connect**: Verify contract address and network configuration
3. **FHEVM functions not working**: Ensure you're on a network that supports FHEVM

### Getting Help

- Check the [FHEVM documentation](https://docs.zama.ai/fhevm)
- Join the [Zama Discord](https://discord.gg/zama)
- Open an issue on this repository

## Security Considerations

- Never commit private keys to version control
- Use environment variables for sensitive configuration
- Test thoroughly on testnets before mainnet deployment
- Consider using multi-signature wallets for production deployments
