# FHEVM SDK Architecture

This document provides a detailed overview of the FHEVM SDK architecture, design decisions, and implementation details.

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Core Principles](#core-principles)
3. [Package Structure](#package-structure)
4. [SDK Core Architecture](#sdk-core-architecture)
5. [React Integration](#react-integration)
6. [Example Applications](#example-applications)
7. [FHE Workflow](#fhe-workflow)
8. [Type System](#type-system)
9. [Error Handling](#error-handling)
10. [Performance Considerations](#performance-considerations)

## High-Level Overview

The FHEVM SDK is designed as a layered architecture:

```
┌─────────────────────────────────────────────┐
│         Application Layer                    │
│  (Next.js, React, Vue, Vanilla JS Apps)     │
└─────────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────────┐
│      Framework Integration Layer             │
│    (React Hooks, Vue Composables, etc.)     │
└─────────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────────┐
│           SDK Core Layer                     │
│  (FhevmClient, Encryption, Decryption)      │
└─────────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────────┐
│        Blockchain Layer                      │
│      (ethers.js, fhevmjs, Gateway)          │
└─────────────────────────────────────────────┘
```

## Core Principles

### 1. Framework Agnostic

**Design Decision**: The core SDK has zero framework dependencies.

**Implementation**:
- Core SDK exports pure TypeScript functions
- React bindings are optional, in separate export path
- Can be used in any JavaScript environment

```typescript
// Core SDK - no framework deps
export async function createFhevmInstance(config) { }

// React bindings - separate export
export { FhevmProvider, useFhevm } from './react';
```

### 2. Developer Experience

**Inspired by wagmi**: Familiar patterns for web3 developers.

**Key Features**:
- Simple initialization
- Intuitive hook names (`useEncryptedInput`, `useDecrypt`)
- Consistent error handling
- TypeScript-first approach

### 3. Type Safety

**Design Decision**: Comprehensive TypeScript typing throughout.

**Benefits**:
- Catch errors at compile time
- Excellent IDE autocomplete
- Self-documenting API

### 4. Modularity

**Principle**: Each feature is independently importable.

```typescript
// Import only what you need
import { createFhevmInstance } from '@fhevm/sdk';
import { useEncryptedInput } from '@fhevm/sdk/react';
```

## Package Structure

### Monorepo Organization

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── index.ts        # Main exports
│       │   ├── client.ts       # FhevmClient class
│       │   ├── instance.ts     # Instance creation
│       │   ├── encryption.ts   # Encryption utilities
│       │   ├── decrypt.ts      # Decryption utilities
│       │   ├── types.ts        # Type definitions
│       │   ├── config/
│       │   │   └── chains.ts   # Chain configurations
│       │   └── react/          # React integration
│       │       ├── index.ts
│       │       ├── FhevmProvider.tsx
│       │       ├── useFhevmClient.ts
│       │       ├── useFhevmContract.ts
│       │       ├── useEncryptedInput.ts
│       │       └── useDecrypt.ts
│       ├── package.json
│       └── tsconfig.json
└── examples/                   # Example applications
```

### Export Strategy

**Dual exports for maximum compatibility**:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/index.mjs",
      "require": "./dist/react/index.js",
      "types": "./dist/react/index.d.ts"
    }
  }
}
```

## SDK Core Architecture

### FhevmClient Class

**Purpose**: Central client for FHEVM operations.

**Responsibilities**:
- Initialize FHEVM instance
- Manage provider and signer
- Provide contract factory methods
- Handle instance lifecycle

```typescript
export class FhevmClient {
  private instance: FhevmInstance | null;
  private provider: Provider;
  private signer: Signer | null;

  constructor(config: FhevmConfig) {
    this.provider = config.provider;
    this.signer = null;
    this.instance = null;
  }

  async initialize(): Promise<void> {
    this.instance = await createInstance(this.provider);
    this.signer = await this.provider.getSigner();
  }

  getInstance(): FhevmInstance {
    if (!this.instance) throw new Error('Not initialized');
    return this.instance;
  }

  async getContract(address: string, abi: any): Promise<Contract> {
    return new Contract(address, abi, this.provider);
  }

  async getConnectedContract(address: string, abi: any): Promise<Contract> {
    const signer = await this.getSigner();
    return new Contract(address, abi, signer);
  }
}
```

### Instance Management

**Pattern**: Singleton instance per provider.

**Lifecycle**:
1. Create client with provider
2. Initialize (async) - creates FHEVM instance
3. Use instance for encryption/decryption
4. Cleanup on unmount (React)

```typescript
// Instance creation
export async function createFhevmInstance(
  config: FhevmConfig
): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.initialize();
  return client;
}
```

### Encryption Module

**Design**: Wrapper around fhevmjs encryption.

**Features**:
- Type-safe encryption for all FHE types
- Automatic handle generation
- Batch encryption support

```typescript
export interface EncryptedData {
  data: Uint8Array;
  handles: string[];
}

export async function encryptInput(
  instance: FhevmInstance,
  value: number | boolean,
  type: EncryptionType
): Promise<EncryptedData> {
  const encrypted = await instance.encrypt(value, type);
  return {
    data: encrypted.data,
    handles: encrypted.handles
  };
}
```

### Decryption Module

**Two decryption methods**:

1. **User Decryption** (EIP-712 signature required)
2. **Public Decryption** (no signature needed)

```typescript
// User decryption with signature
export async function userDecrypt(
  contractAddress: string,
  handle: string,
  signer: Signer
): Promise<bigint> {
  // Generate EIP-712 signature
  const signature = await generateSignature(signer, handle);
  // Request decryption
  return await requestDecryption(contractAddress, handle, signature);
}

// Public decryption
export async function publicDecrypt(
  contractAddress: string,
  handle: string
): Promise<bigint> {
  return await requestPublicDecryption(contractAddress, handle);
}
```

## React Integration

### Context Architecture

**Pattern**: React Context + Provider pattern.

```typescript
interface FhevmContextValue {
  client: FhevmClient | null;
  isReady: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue | null>(null);

export function FhevmProvider({ children, provider }: Props) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const fhevmClient = await createFhevmInstance({ provider });
        setClient(fhevmClient);
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    }
    init();
  }, [provider]);

  return (
    <FhevmContext.Provider value={{ client, isReady, error }}>
      {children}
    </FhevmContext.Provider>
  );
}
```

### Hook Design

**Convention**: All hooks follow the `use*` naming pattern.

#### useFhevmClient

**Purpose**: Create and manage FHEVM client instance.

```typescript
export function useFhevmClient(options: Options) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initialize() {
      if (!options.provider) return;

      try {
        setIsLoading(true);
        const fhevm = await createFhevmInstance(options);
        setClient(fhevm);
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [options.provider]);

  return { client, isLoading, isReady, error };
}
```

#### useEncryptedInput

**Purpose**: Encrypt data for contract submission.

```typescript
export function useEncryptedInput() {
  const { client, isReady } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | boolean, type: EncryptionType) => {
      if (!client || !isReady) {
        throw new Error('FHEVM not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const instance = client.getInstance();
        const encrypted = await encryptInput(instance, value, type);
        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  return { encrypt, isEncrypting, error };
}
```

## Example Applications

### Next.js Example

**Architecture**: App Router with Client Components.

**Key Files**:
- `app/layout.tsx` - Root layout
- `app/providers.tsx` - FHEVM Provider setup
- `app/page.tsx` - Main page with encryption demo

**Pattern**:
```typescript
// Providers run on client
'use client';

export function Providers({ children }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new BrowserProvider(window.ethereum));
    }
  }, []);

  return (
    <FhevmProvider provider={provider}>
      {children}
    </FhevmProvider>
  );
}
```

### Patent License Example

**Architecture**: Vanilla JavaScript with HTML.

**Key Components**:
- `index.html` - UI and JavaScript
- `contracts/` - Solidity contracts
- `scripts/` - Deployment scripts

**Integration**:
```javascript
// Direct SDK usage
import { createFhevmInstance } from '@fhevm/sdk';

const provider = new ethers.BrowserProvider(window.ethereum);
const fhevm = await createFhevmInstance({ provider });
const contract = await fhevm.getConnectedContract(address, abi);
```

## FHE Workflow

### Complete Encryption Flow

```
User Input → Frontend Encryption → Contract Call → Blockchain
                    ↓
              [FHEVM SDK]
                    ↓
         Create Encrypted Data
                    ↓
      Generate Encryption Handles
                    ↓
         Return { data, handles }
                    ↓
      Submit to Smart Contract
```

### Complete Decryption Flow

```
Contract → Request Decryption → Gateway → Return Result
                ↓
         [User Signature]
                ↓
        EIP-712 Signature
                ↓
          Submit Request
                ↓
       Decrypt with Gateway
                ↓
         Return Plaintext
```

## Type System

### Core Types

```typescript
// Encryption types
export type EncryptionType =
  | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128'
  | 'bool' | 'address';

// Configuration
export interface FhevmConfig {
  provider: BrowserProvider | JsonRpcProvider;
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

// Encrypted data
export interface EncryptedData {
  data: Uint8Array;
  handles: string[];
}

// Contract options
export interface ContractOptions {
  address: string;
  abi: any[];
  withSigner?: boolean;
}
```

## Error Handling

### Error Strategy

**Principle**: Fail fast with clear error messages.

**Pattern**:
```typescript
export class FhevmError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FhevmError';
  }
}

// Usage
if (!instance) {
  throw new FhevmError(
    'FHEVM instance not initialized. Call createFhevmInstance first.',
    'NOT_INITIALIZED'
  );
}
```

### Hook Error Handling

**Pattern**: Return error state instead of throwing.

```typescript
const { encrypt, error } = useEncryptedInput();

if (error) {
  // Display error to user
  console.error('Encryption failed:', error);
}
```

## Performance Considerations

### Initialization

**Optimization**: Lazy initialization of FHEVM instance.

- Instance created only when needed
- Cached after first creation
- Shared across components (via Context)

### Encryption

**Considerations**:
- Encryption is CPU-intensive
- Show loading states during encryption
- Consider batch encryption for multiple values

### Memory Management

**React Hooks**:
- Cleanup effects on unmount
- Cancel pending operations
- Clear references to large objects

## Future Enhancements

### Planned Features

1. **Vue Integration** - Vue composables similar to React hooks
2. **Batch Operations** - Encrypt/decrypt multiple values efficiently
3. **Caching** - Cache encrypted values for repeated use
4. **Offline Support** - Queue operations when offline
5. **Enhanced TypeScript** - More strict typing for contract ABIs

### Extensibility

**Plugin System**: Allow custom encryption/decryption providers.

```typescript
interface FhevmPlugin {
  name: string;
  initialize(client: FhevmClient): void;
  beforeEncrypt?(value: any): any;
  afterEncrypt?(encrypted: EncryptedData): EncryptedData;
}
```

---

**This architecture is designed to be simple, extensible, and developer-friendly while providing powerful FHE capabilities.**
