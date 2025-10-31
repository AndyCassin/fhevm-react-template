# FHEVM SDK - Universal Confidential Frontend Framework

> Build confidential dApps with ease using our framework-agnostic FHEVM SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## Overview

The **FHEVM SDK** is a universal, framework-agnostic software development kit that simplifies building confidential frontends with Fully Homomorphic Encryption (FHE). Inspired by wagmi's developer-friendly structure, this SDK wraps all necessary FHEVM packages and provides a clean, modular API for working with encrypted data on the blockchain.

### Key Features

- **Framework-Agnostic Core** - Works seamlessly with Node.js, Next.js, React, Vue, or vanilla JavaScript
- **Unified Package** - All FHEVM dependencies bundled in one SDK
- **wagmi-like Developer Experience** - Intuitive API structure familiar to web3 developers
- **React Hooks** - Optional React bindings for rapid UI development
- **Complete FHE Workflow** - Initialization, encryption, decryption, and contract interaction
- **TypeScript First** - Fully typed for excellent developer experience
- **EIP-712 Signatures** - Built-in support for user and public decryption


**Watch the Demo**: [View demonstration demo.mp4]

## 🚀 Live Application

Access the platform at: **[https://fhe-patent-license.vercel.app/](https://fhe-patent-license.vercel.app/)**

## Quick Start

### Installation

Install the SDK from the root directory:

```bash
npm install
```

This will install all dependencies across the monorepo, including the SDK and example applications.

### Run Examples

#### Next.js Example

```bash
npm run dev:nextjs
```

Open [http://localhost:3000](http://localhost:3000) to see the Next.js example in action.

#### Patent License Example

```bash
npm run dev:patent
```

This demonstrates a complete confidential patent licensing platform.

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # Core SDK package
│       ├── src/
│       │   ├── client.ts    # Main FHEVM client
│       │   ├── instance.ts  # Instance creation
│       │   ├── encryption.ts # Encryption utilities
│       │   ├── decrypt.ts   # Decryption utilities
│       │   └── react/       # React hooks and providers
│       ├── package.json
│       └── README.md
├── examples/
│   ├── nextjs-example/      # Next.js 14 App Router example with full SDK integration
│   │   ├── app/            # Next.js App Router
│   │   │   ├── api/        # API routes for FHE operations
│   │   │   ├── layout.tsx  # Root layout with providers
│   │   │   └── page.tsx    # Home page with demos
│   │   ├── components/     # React components
│   │   │   ├── ui/         # UI components (Button, Input, Card)
│   │   │   ├── fhe/        # FHE demos (Encryption, Computation, KeyManager)
│   │   │   └── examples/   # Use cases (Banking, Medical)
│   │   ├── hooks/          # Custom FHE hooks
│   │   ├── lib/            # Utilities (client, server, keys, validation, security)
│   │   └── types/          # TypeScript type definitions
│   ├── patent-license/      # Confidential patent licensing dApp
│   └── node-vanilla/        # Pure Node.js example
├── templates/               # Template directory (symlinks to examples)
│   └── nextjs/             # Next.js template
├── package.json             # Root package.json with workspace config
└── README.md               # This file
```

## Usage

### Vanilla JavaScript/TypeScript

```typescript
import { createFhevmInstance } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize FHEVM
const provider = new BrowserProvider(window.ethereum);
const fhevm = await createFhevmInstance({ provider });

// Get instance for encryption
const instance = fhevm.getInstance();

// Encrypt data
const encrypted = await instance.encrypt32(42);

// Use with smart contract
const contract = await fhevm.getConnectedContract(contractAddress, contractABI);
await contract.submitConfidentialData(encrypted.data, encrypted.handles);
```

### React with Hooks

```tsx
import { FhevmProvider, useFhevmContract, useEncryptedInput } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';

function App() {
  const provider = new BrowserProvider(window.ethereum);

  return (
    <FhevmProvider provider={provider}>
      <ConfidentialComponent />
    </FhevmProvider>
  );
}

function ConfidentialComponent() {
  const { encrypt } = useEncryptedInput();
  const contract = useFhevmContract({
    address: '0x...',
    abi: contractABI,
    withSigner: true
  });

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint32');
    await contract.submitData(encrypted.data, encrypted.handles);
  };

  return <button onClick={() => handleSubmit(42)}>Submit Encrypted</button>;
}
```

### Next.js App Router

```tsx
// app/providers.tsx
'use client';

import { FhevmProvider } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new BrowserProvider(window.ethereum));
    }
  }, []);

  if (!provider) return <div>Loading...</div>;

  return <FhevmProvider provider={provider}>{children}</FhevmProvider>;
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## SDK API Reference

### Core Functions

#### `createFhevmInstance(config)`

Creates and initializes an FHEVM client instance.

**Parameters:**
- `provider`: ethers BrowserProvider or JsonRpcProvider
- `chainId?`: Optional chain ID (auto-detected if not provided)
- `gatewayUrl?`: Optional custom gateway URL
- `aclAddress?`: Optional custom ACL contract address

**Returns:** `Promise<FhevmClient>`

#### `FhevmClient` Methods

- `getInstance()` - Get the underlying fhevmjs instance
- `getSigner()` - Get the ethers signer
- `getContract(address, abi)` - Get read-only contract instance
- `getConnectedContract(address, abi)` - Get contract instance with signer

### Encryption

```typescript
import { encryptInput } from '@fhevm/sdk';

const encrypted = await encryptInput(instance, value, type);
```

**Supported Types:**
- `uint8`, `uint16`, `uint32`, `uint64`, `uint128`
- `bool`
- `address`

**Returns:** `{ data: Uint8Array, handles: string[] }`

### Decryption

#### User Decryption (EIP-712)

```typescript
import { useUserDecrypt } from '@fhevm/sdk';

const result = await useUserDecrypt({
  contractAddress: '0x...',
  handle: encryptedDataHandle,
  signer: ethersSigner
});
```

#### Public Decryption

```typescript
import { usePublicDecrypt } from '@fhevm/sdk';

const result = await usePublicDecrypt(contractAddress, handle);
```

### React Hooks

#### `useFhevmClient()`

```tsx
const { client, isLoading, isReady, error } = useFhevmClient({ provider });
```

#### `useFhevmContract()`

```tsx
const contract = useFhevmContract({
  address: '0x123...',
  abi: myContractABI,
  withSigner: true // false for read-only
});
```

#### `useEncryptedInput()`

```tsx
const { encrypt, isEncrypting, error } = useEncryptedInput();
const encrypted = await encrypt(42, 'uint32');
```

#### `useDecrypt()`

```tsx
const { decrypt, isDecrypting, result } = useDecrypt();
await decrypt('0x...', handleValue);
```

## Examples

### 1. Next.js Example

A comprehensive Next.js 14 application with complete SDK integration, API routes, and real-world examples.

**Location:** `examples/nextjs-example/`

**Features:**
- Server and client component patterns with App Router
- Complete API routes for FHE operations (encrypt, decrypt, compute, keys)
- Advanced React hooks (useFHE, useEncryption, useComputation)
- Interactive demos (EncryptionDemo, ComputationDemo, KeyManager)
- Real-world use cases (Banking, Medical Records)
- Full component library (Button, Input, Card)
- TypeScript type definitions for all FHE operations
- Security utilities and input validation
- Wallet connection with MetaMask
- Encrypted form submissions with homomorphic computation

### 2. Confidential Patent License Platform

A complete dApp for managing patent licenses with confidential terms.

**Location:** `examples/patent-license/`

**Features:**
- Patent registration with encrypted royalty rates
- Confidential license negotiations
- Encrypted bidding system
- Private revenue reporting
- Full FHE workflow demonstration

### 3. Node.js Vanilla Example

Pure Node.js implementation without any framework.

**Location:** `examples/node-vanilla/`

**Features:**
- CLI-based interaction
- Direct SDK usage
- Contract deployment
- Encryption/decryption examples

## Development

### Build the SDK

```bash
cd packages/fhevm-sdk
npm run build
```

### Run Tests

```bash
cd packages/fhevm-sdk
npm test
```

### Development Mode

```bash
npm run dev:sdk
```

This watches for file changes and rebuilds automatically.

## Deployment

### Deploy Smart Contracts

```bash
cd examples/patent-license
npm run compile
npm run deploy
```

### Deploy Frontend

#### Vercel (Recommended for Next.js)

```bash
cd examples/nextjs-example
vercel deploy
```

#### Netlify

```bash
cd examples/nextjs-example
npm run build
netlify deploy --prod
```

#### GitHub Pages (Static)

For static builds, configure your build output and deploy via GitHub Actions.

## Documentation

- [SDK Package README](./packages/fhevm-sdk/README.md) - Detailed SDK documentation
- [Next.js Example Guide](./examples/nextjs-example/README.md) - Next.js integration guide
- [Patent License Guide](./examples/patent-license/README.md) - Complete dApp tutorial
- [API Reference](./docs/API.md) - Full API documentation

## Requirements

- Node.js 18+ or 20+
- npm 9+ or yarn 1.22+
- MetaMask or compatible Web3 wallet
- Ethereum Sepolia testnet access (for examples)

## Architecture

### SDK Design Principles

1. **Framework Agnostic Core** - The core SDK (`@fhevm/sdk`) has no framework dependencies
2. **Optional React Bindings** - React hooks are provided as an optional export (`@fhevm/sdk/react`)
3. **Modular Structure** - Each feature (encryption, decryption, contracts) is a separate module
4. **Type Safety** - Full TypeScript support with comprehensive type definitions
5. **Developer Experience** - wagmi-like API for familiar patterns

### Workflow

```
User Input → SDK Encryption → Smart Contract → Blockchain
                ↓                    ↓
          Encrypted Data    →   FHE Operations
                                     ↓
          Result Decryption ← Encrypted Result
                ↓
          User Display
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on top of [fhevmjs](https://github.com/zama-ai/fhevmjs)
- Inspired by [wagmi](https://wagmi.sh/) for developer experience
- Powered by [Zama](https://www.zama.ai/) FHE technology

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/your-repo/issues)
- Documentation: [Full docs](./docs/)
- Examples: Check the `examples/` directory

---

**Built with privacy in mind using Fully Homomorphic Encryption**
