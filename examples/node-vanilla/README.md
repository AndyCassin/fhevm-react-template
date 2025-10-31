# Node.js Vanilla FHEVM Example

This is a pure Node.js example demonstrating how to use the FHEVM SDK without any frontend framework.

## Features

- **Framework-agnostic**: Pure Node.js with no UI framework dependencies
- **Complete SDK integration**: Shows all core FHEVM SDK features
- **Multiple examples**: Encryption, decryption, and contract interaction
- **CLI-based**: Easy to run and test from the command line
- **Educational**: Clear code with extensive comments

## Prerequisites

- Node.js 18+ or 20+
- An Ethereum wallet with a private key
- Access to a FHEVM-compatible network (e.g., Zama Devnet)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://devnet.zama.ai
CONTRACT_ADDRESS=your_contract_address
GATEWAY_URL=
ACL_ADDRESS=
```

⚠️ **Important**: Never commit your `.env` file with real credentials!

## Usage

### Run Main Example

```bash
npm start
```

This will:
1. Initialize the FHEVM instance
2. Encrypt a sample value
3. Display available methods
4. Show next steps

### Encryption Examples

```bash
npm run encrypt
```

Demonstrates encrypting different data types:
- Boolean values
- uint8, uint16, uint32, uint64
- Ethereum addresses

### Decryption Examples

```bash
npm run decrypt
```

Shows how to:
- Perform user decryption (EIP-712)
- Perform public decryption
- Handle decryption workflows

**Note**: Requires `CONTRACT_ADDRESS` in `.env`

### Contract Interaction

```bash
npm run contract
```

Demonstrates:
- Encrypting data for contract submission
- Getting contract instances with signer
- Submitting transactions
- Reading encrypted data from contracts

**Note**: Requires `CONTRACT_ADDRESS` in `.env`

## Project Structure

```
node-vanilla/
├── src/
│   ├── index.js              # Main entry point
│   └── examples/
│       ├── encrypt.js        # Encryption examples
│       ├── decrypt.js        # Decryption examples
│       └── contract.js       # Contract interaction
├── package.json
├── .env.example
└── README.md
```

## Code Examples

### Basic Initialization

```javascript
import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet } from 'ethers';

const provider = new JsonRpcProvider('https://devnet.zama.ai');
const signer = new Wallet(privateKey, provider);

const fhevmClient = await createFhevmInstance({ provider: signer });
const instance = fhevmClient.getInstance();
```

### Encrypting Data

```javascript
// Encrypt different types
const encryptedBool = await instance.encryptBool(true);
const encryptedUint32 = await instance.encrypt32(42);
const encryptedAddress = await instance.encryptAddress('0x...');
```

### Contract Interaction

```javascript
// Get contract with signer
const contract = fhevmClient.getConnectedContract(address, abi);

// Encrypt and submit
const encrypted = await instance.encrypt32(secretValue);
const tx = await contract.submitValue(encrypted.data);
await tx.wait();
```

### Decryption

```javascript
import { useUserDecrypt } from '@fhevm/sdk';

// User decryption (requires signature)
const result = await useUserDecrypt({
  contractAddress: '0x...',
  handle: encryptedHandle,
  signer: yourSigner
});
```

## SDK Methods Used

### Core
- `createFhevmInstance()` - Initialize FHEVM client
- `getInstance()` - Get instance for encryption
- `getConnectedContract()` - Get contract with signer

### Encryption
- `encrypt8()`, `encrypt16()`, `encrypt32()`, `encrypt64()`, `encrypt128()`
- `encryptBool()`
- `encryptAddress()`

### Decryption
- `useUserDecrypt()` - User decryption with EIP-712
- `usePublicDecrypt()` - Public decryption

## Development

### Watch Mode

For development with auto-reload:

```bash
npm run dev
```

### Debugging

Add `console.log()` statements or use Node.js debugger:

```bash
node --inspect src/index.js
```

## Troubleshooting

### "No Ethereum provider found"

This error occurs when PRIVATE_KEY is not set. Make sure your `.env` file contains a valid private key.

### "Failed to initialize FHE"

Check that:
- Your RPC_URL is correct and accessible
- The network supports FHEVM
- Your wallet has sufficient funds

### "Contract interaction failed"

Ensure:
- CONTRACT_ADDRESS is set in `.env`
- The contract is deployed to the network
- Your wallet has permission to interact with the contract

## Next Steps

1. **Deploy a Contract**: Use Hardhat to deploy a confidential contract
2. **Integrate with Frontend**: Use this as backend for a React/Next.js app
3. **Build CLI Tools**: Create command-line tools for FHE operations
4. **Automate Workflows**: Use in scripts for batch operations

## Resources

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama Documentation](https://docs.zama.ai/)
- [fhevmjs](https://github.com/zama-ai/fhevmjs)

## License

MIT
