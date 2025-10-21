# Confidential Patent License Platform

A complete decentralized application for managing patent licenses with fully confidential terms using Fully Homomorphic Encryption (FHE).

## Overview

This example demonstrates a production-ready dApp that leverages the FHEVM SDK to build a confidential patent licensing platform. Key features include:

- **Confidential Patent Registration** - Register patents with encrypted royalty rates and licensing fees
- **Private License Negotiations** - Request licenses without revealing proposed terms
- **Encrypted Bidding System** - Conduct confidential auctions for exclusive licenses
- **Confidential Revenue Reporting** - Pay royalties with encrypted revenue data
- **Full FHE Workflow** - Complete encryption/decryption cycle demonstration

## Features

### For Patent Owners

- Register patents with confidential licensing terms
- Start confidential bidding for exclusive licenses
- Approve or reject license requests
- Verify royalty payments with encrypted revenue data
- Update patent status (Active/Suspended/Expired)

### For Licensees

- Request licenses with private proposed terms
- Submit confidential bids for exclusive rights
- Pay royalties with encrypted revenue reporting
- Manage active licenses

## Technology Stack

- **Smart Contracts**: Solidity with FHEVM encryption
- **Frontend**: Vanilla JavaScript with FHEVM SDK
- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption**: Zama FHEVM (Fully Homomorphic Encryption)
- **Development**: Hardhat

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- MetaMask browser extension
- Sepolia testnet ETH
- Hardhat environment

### Installation

From the root directory:

```bash
npm install
```

Or from this directory:

```bash
cd examples/patent-license
npm install
```

### Environment Setup

Create a `.env` file:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy

```bash
npm run deploy
```

After deployment, update the `CONTRACT_ADDRESS` in `index.html` with your deployed contract address.

### Run Frontend

```bash
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
patent-license/
├── contracts/
│   └── ConfidentialPatentLicense.sol   # Main smart contract
├── scripts/
│   ├── deploy.js                        # Deployment script
│   └── verify.js                        # Contract verification
├── test/
│   └── ConfidentialPatentLicense.test.js
├── index.html                           # Frontend application
├── hardhat.config.js
├── package.json
└── README.md
```

## Smart Contract

### Key Functions

#### Patent Registration

```solidity
function registerPatent(
    uint64 royaltyRate,
    uint64 minLicenseFee,
    uint32 exclusivityPeriod,
    uint256 validityYears,
    string calldata patentHash,
    uint8 territoryCode,
    bool isConfidential
) external returns (uint256 patentId)
```

#### License Request

```solidity
function requestLicense(
    uint256 patentId,
    uint64 proposedFee,
    uint64 proposedRoyaltyRate,
    uint32 revenueCap,
    uint256 durationDays,
    bool requestExclusive,
    bool autoRenewal,
    uint8 territoryMask
) external returns (uint256 licenseId)
```

#### Confidential Bidding

```solidity
function submitConfidentialBid(
    uint256 patentId,
    uint64 bidAmount
) external
```

#### Royalty Payment

```solidity
function payRoyalties(
    uint256 licenseId,
    uint64 reportedRevenue,
    uint256 reportingPeriod
) external payable
```

## FHEVM SDK Integration

This example uses the FHEVM SDK for all encryption operations:

```javascript
import { createFhevmInstance } from '@fhevm/sdk';

// Initialize FHEVM
const provider = new ethers.BrowserProvider(window.ethereum);
const fhevm = await createFhevmInstance({ provider });

// Get contract with SDK
const contract = await fhevm.getConnectedContract(contractAddress, contractABI);

// The SDK handles encryption automatically
await contract.registerPatent(
    royaltyRate,    // Encrypted internally
    minLicenseFee,  // Encrypted internally
    // ... other parameters
);
```

## Usage Workflow

### 1. Patent Owner Workflow

1. **Connect Wallet** - Connect MetaMask to Sepolia
2. **Register Patent** - Fill in patent details and choose confidentiality settings
3. **Start Bidding** (Optional) - Initiate confidential bidding for exclusive licenses
4. **Review Requests** - Check license requests in the "Manage" tab
5. **Approve Licenses** - Accept license proposals
6. **Verify Royalties** - Review royalty payments with encrypted revenue data

### 2. Licensee Workflow

1. **Connect Wallet** - Connect MetaMask to Sepolia
2. **Browse Patents** - View available patents in the "View All" tab
3. **Request License** - Submit a license request with proposed terms
4. **Submit Bid** (Optional) - Place confidential bid for exclusive license
5. **Pay Royalties** - Submit royalty payments with encrypted revenue reporting

### 3. Confidential Bidding Flow

1. Patent owner starts bidding with duration
2. Bidders submit encrypted bid amounts
3. After bidding period ends, patent owner finalizes
4. Highest bidder automatically receives exclusive license

## Encryption Examples

### Encrypting Patent Terms

```javascript
// Royalty rate encrypted on-chain
const royaltyRate = 500; // 5% in basis points
await contract.registerPatent(
    royaltyRate,  // Encrypted via FHE
    minLicenseFee,
    exclusivityPeriod,
    // ...
);
```

### Confidential Bidding

```javascript
// Bid amount encrypted, hidden from others
const bidAmount = ethers.parseEther("10.0");
await contract.submitConfidentialBid(patentId, bidAmount);
// Other bidders cannot see your bid amount
```

### Private Revenue Reporting

```javascript
// Revenue reported confidentially
const reportedRevenue = ethers.parseEther("100.0");
await contract.payRoyalties(
    licenseId,
    reportedRevenue,  // Encrypted
    reportingPeriod,
    { value: royaltyAmount }
);
```

## Security Features

- **FHE Encryption** - All sensitive data encrypted on-chain
- **Access Control** - Patent owners and licensees have restricted access
- **EIP-712 Signatures** - Secure decryption with signed messages
- **Confidential Bidding** - Bid amounts hidden until finalization
- **Revenue Privacy** - Royalty calculations on encrypted data

## Testing

The project includes comprehensive tests:

```bash
npm test
```

Test coverage includes:
- Patent registration with encryption
- License request and approval flow
- Confidential bidding mechanics
- Royalty payment verification
- Access control and permissions

## Deployment

### Sepolia Testnet

```bash
npm run deploy
```

### Verify on Etherscan

```bash
npm run verify
```

## Configuration

### Hardhat Config

The `hardhat.config.js` is configured for:
- Sepolia testnet deployment
- Zama FHEVM integration
- Gas optimization
- Contract verification

### Network Details

- **Network**: Sepolia
- **Chain ID**: 11155111
- **FHEVM Gateway**: Zama Gateway for Sepolia

## Troubleshooting

### MetaMask Connection Issues

Ensure you're on Sepolia testnet:
- Network Name: Sepolia
- RPC URL: https://eth-sepolia.g.alchemy.com/v2/...
- Chain ID: 11155111

### Contract Interaction Errors

1. Check contract address in `index.html`
2. Ensure wallet has sufficient Sepolia ETH
3. Verify MetaMask is connected

### Encryption Errors

The FHEVM SDK handles encryption automatically. If you encounter issues:
1. Check browser console for detailed errors
2. Ensure FHEVM instance is initialized
3. Verify contract is deployed correctly

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

MIT

## Support

For issues or questions:
- Check GitHub Issues
- Review FHEVM SDK documentation
- Consult Zama documentation
