# @fhevm/sdk

> Universal FHEVM SDK - Framework-agnostic toolkit for building confidential frontends with Fully Homomorphic Encryption

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Overview

The FHEVM SDK is a universal, framework-agnostic software development kit that makes it easy to build confidential frontends with Fully Homomorphic Encryption (FHE). Built on top of fhevmjs, it provides a clean, modular API inspired by wagmi for working with encrypted data on the blockchain.

## Features

- **Framework-Agnostic Core** - Works with Node.js, Next.js, React, Vue, or vanilla JavaScript
- **Unified Package** - All FHEVM dependencies in one place
- **wagmi-like API** - Familiar structure for web3 developers
- **React Hooks** - Optional React bindings for rapid development
- **Full FHE Workflow** - Complete encryption, decryption, and contract interaction
- **TypeScript First** - Fully typed for excellent DX
- **EIP-712 Support** - Built-in user and public decryption

## Installation

```bash
npm install @fhevm/sdk ethers
```

## Quick Start

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
const { encryptInput } = await import('@fhevm/sdk');
const encrypted = await encryptInput(instance, 42, 'uint32');

// Use with smart contract
const contract = await fhevm.getConnectedContract(contractAddress, contractABI);
await contract.submitConfidentialData(encrypted.data);
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
    await contract.submitData(encrypted.data);
  };

  return <button onClick={() => handleSubmit(42)}>Submit Encrypted</button>;
}
```

## API Reference

### Core Functions

#### `createFhevmInstance(config)`

Creates and initializes an FHEVM client instance.

**Parameters:**
- `provider`: ethers BrowserProvider or JsonRpcProvider
- `chainId?`: Optional chain ID (auto-detected if not provided)
- `gatewayUrl?`: Optional custom gateway URL
- `aclAddress?`: Optional custom ACL contract address

**Returns:** `Promise<FhevmClient>`

**Example:**
```typescript
const fhevm = await createFhevmInstance({
  provider: new BrowserProvider(window.ethereum),
  chainId: 8009
});
```

#### `FhevmClient` Methods

- `getInstance()` - Get the underlying fhevmjs instance
- `getSigner()` - Get the ethers signer
- `getContract(address, abi)` - Get read-only contract instance
- `getConnectedContract(address, abi)` - Get contract instance with signer

### Encryption

#### `encryptInput(instance, value, type)`

Encrypts a value using the specified FHE type.

**Parameters:**
- `instance`: FhevmInstance from `client.getInstance()`
- `value`: The value to encrypt (number, boolean, or string)
- `type`: EncryptionType - one of:
  - `'bool'` - Boolean values
  - `'uint8'`, `'uint16'`, `'uint32'`, `'uint64'`, `'uint128'`, `'uint256'` - Unsigned integers
  - `'address'` - Ethereum addresses

**Returns:** `Promise<EncryptedValue>` with `{ data: Uint8Array, handles: string[] }`

**Example:**
```typescript
const encrypted = await encryptInput(instance, 42, 'uint32');
```

#### `EncryptionHelper`

Class-based encryption helper with convenience methods.

```typescript
const helper = new EncryptionHelper(instance);
const encrypted = await helper.encryptUint32(42);
```

### Decryption

#### `userDecrypt(options)`

Decrypt encrypted data using user's EIP-712 signature.

**Parameters:**
- `contractAddress`: Address of the contract
- `handle`: Encrypted data handle
- `signer`: Ethers signer

**Returns:** `Promise<bigint>`

**Example:**
```typescript
const decrypted = await userDecrypt({
  contractAddress: '0x...',
  handle: encryptedHandle,
  signer: await fhevm.getSigner()
});
```

#### `publicDecrypt(options)`

Decrypt publicly available encrypted data.

**Parameters:**
- `contractAddress`: Address of the contract
- `handle`: Encrypted data handle

**Returns:** `Promise<bigint>`

### React Hooks

#### `useFhevmClient(options)`

Hook to create and manage an FHEVM client instance.

**Parameters:**
- `provider?`: Ethers provider
- `chainId?`: Optional chain ID
- `gatewayUrl?`: Optional gateway URL
- `aclAddress?`: Optional ACL address

**Returns:**
```typescript
{
  client: FhevmClient | null;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}
```

**Example:**
```tsx
const { client, isReady } = useFhevmClient({ provider });
```

#### `useFhevmContract(options)`

Hook to create a contract instance with FHEVM support.

**Parameters:**
- `address`: Contract address
- `abi`: Contract ABI
- `withSigner?`: Whether to connect with signer (default: false)

**Returns:** `Contract | null`

**Example:**
```tsx
const contract = useFhevmContract({
  address: '0x123...',
  abi: myContractABI,
  withSigner: true
});
```

#### `useEncryptedInput()`

Hook for encrypting input values.

**Returns:**
```typescript
{
  encrypt: (value, type) => Promise<EncryptedValue>;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**
```tsx
const { encrypt, isEncrypting } = useEncryptedInput();
const encrypted = await encrypt(42, 'uint32');
```

#### `useDecrypt()`

Hook for decrypting values with EIP-712 signatures.

**Returns:**
```typescript
{
  decrypt: (contractAddress, handle) => Promise<bigint>;
  isDecrypting: boolean;
  result: bigint | null;
  error: Error | null;
}
```

**Example:**
```tsx
const { decrypt, result } = useDecrypt();
await decrypt('0x...', handleValue);
console.log(result); // Decrypted value
```

## Advanced Usage

### Custom Configuration

```typescript
const fhevm = await createFhevmInstance({
  provider: customProvider,
  chainId: 8009,
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...'
});
```

### Multiple Encryptions

```typescript
const helper = new EncryptionHelper(instance);

const encrypted = await Promise.all([
  helper.encryptUint32(42),
  helper.encryptUint64(1000000n),
  helper.encryptBool(true),
  helper.encryptAddress('0x...')
]);
```

### Contract Interaction

```typescript
// Read-only contract
const readContract = fhevm.getContract(address, abi);
const value = await readContract.someReadFunction();

// Write contract (with signer)
const writeContract = await fhevm.getConnectedContract(address, abi);
const encrypted = await encryptInput(instance, 42, 'uint32');
const tx = await writeContract.submitEncrypted(encrypted.data);
await tx.wait();
```

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  FhevmClient,
  FhevmConfig,
  EncryptedValue,
  EncryptionType,
  DecryptOptions
} from '@fhevm/sdk';
```

## Error Handling

```typescript
try {
  const encrypted = await encrypt(value, 'uint32');
} catch (error) {
  if (error.message.includes('not ready')) {
    console.error('FHEVM client not initialized');
  } else {
    console.error('Encryption failed:', error);
  }
}
```

## Requirements

- Node.js 18+ or 20+
- ethers ^6.9.0
- React ^18.0.0 (only if using React hooks)

## License

MIT - see [LICENSE](../../LICENSE) file for details

## Related

- [fhevmjs](https://github.com/zama-ai/fhevmjs) - Core FHE library
- [FHEVM](https://docs.zama.ai/fhevm) - Zama's FHE Virtual Machine
- [Examples](../../examples/) - Complete example applications

## Support

For issues and questions:
- GitHub Issues: [Report bugs or request features](https://github.com/your-repo/issues)
- Documentation: See the [main README](../../README.md)
- Examples: Check the [examples directory](../../examples/)
