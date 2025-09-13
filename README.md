# FHEVM Private Voting dApp

A decentralized voting application that uses FHEVM (Fully Homomorphic Encryption Virtual Machine) to ensure complete privacy while maintaining transparency in results.

## 🎯 Project Overview

This project demonstrates the power of FHEVM technology by creating a private voting system where:
- Individual votes remain encrypted and private
- Only the final results are revealed
- No one can see how any individual voted
- The system is completely transparent and verifiable

## 🚀 Features

- **Complete Privacy**: Votes are encrypted using FHEVM
- **Transparent Results**: Final vote counts are publicly verifiable
- **User-Friendly Interface**: Clean, modern React frontend
- **Blockchain Integration**: Smart contracts on Ethereum-compatible networks
- **Real-time Updates**: Live vote counting and results

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Blockchain**: Solidity, Hardhat
- **Privacy**: FHEVM (Fully Homomorphic Encryption)
- **Wallet Integration**: RainbowKit, Wagmi
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
fhevm-private-voting/
├── contracts/          # Smart contracts
├── frontend/           # React frontend
├── scripts/            # Deployment scripts
├── test/              # Test files
└── docs/              # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fhevm-private-voting
```

2. Install dependencies:
```bash
npm install
```

3. Compile smart contracts:
```bash
npm run compile
```

4. Start the development server:
```bash
npm run dev
```

## 🎮 How to Use

1. **Connect Wallet**: Connect your Ethereum wallet using the "Connect Wallet" button
2. **Create Poll**: Create a new voting poll with options
3. **Vote Privately**: Cast your vote - it will be encrypted using FHEVM
4. **View Results**: See the final results without compromising individual privacy

## 🔒 Privacy Features

- **Encrypted Voting**: All votes are encrypted before being stored
- **Homomorphic Operations**: Vote counting happens on encrypted data
- **Zero-Knowledge**: No individual vote information is ever revealed
- **Verifiable Results**: Anyone can verify the final count is correct

## 🏆 Zama Builder Track Submission

This project is submitted to the Zama Builder Track monthly program, demonstrating:
- Complete dApp implementation using FHEVM
- Both smart contract and frontend components
- Real-world privacy-preserving application
- Production-ready code with comprehensive documentation

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions about this project, please open an issue on GitHub.
