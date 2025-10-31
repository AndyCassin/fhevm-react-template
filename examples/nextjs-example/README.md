# Next.js FHEVM SDK Example

A comprehensive Next.js 14 application demonstrating the FHEVM SDK integration with App Router, showcasing Fully Homomorphic Encryption capabilities.

## Features

This example demonstrates:

- **FHE Encryption/Decryption** - Client-side encryption using FHEVM SDK
- **API Routes** - Server-side FHE operations with Next.js API routes
- **React Hooks** - Custom hooks for FHE operations
- **Interactive Demos** - Real-world examples (Banking, Medical Records)
- **Component Library** - Reusable UI components for FHE operations
- **TypeScript** - Full type safety throughout the application

## Project Structure

```
nextjs-example/
├── app/
│   ├── api/                    # API Routes
│   │   ├── fhe/               # FHE operations
│   │   │   ├── route.ts       # Main FHE endpoint
│   │   │   ├── encrypt/       # Encryption API
│   │   │   ├── decrypt/       # Decryption API
│   │   │   └── compute/       # Computation API
│   │   └── keys/              # Key management API
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── providers.tsx          # FHE provider setup
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # UI Components
│   │   ├── Button.tsx         # Reusable button
│   │   ├── Input.tsx          # Form input
│   │   └── Card.tsx           # Card container
│   ├── fhe/                   # FHE Components
│   │   ├── EncryptionDemo.tsx # Encryption demonstration
│   │   ├── ComputationDemo.tsx# Homomorphic computation
│   │   └── KeyManager.tsx     # Key management UI
│   └── examples/              # Use Case Examples
│       ├── BankingExample.tsx # Confidential banking
│       └── MedicalExample.tsx # Medical records
├── hooks/                     # Custom Hooks
│   ├── useFHE.ts             # Complete FHE operations
│   ├── useEncryption.ts      # Enhanced encryption
│   └── useComputation.ts     # Homomorphic computation
├── lib/                       # Utilities
│   ├── fhe/                  # FHE utilities
│   │   ├── client.ts         # Client-side FHE
│   │   ├── server.ts         # Server-side FHE
│   │   ├── keys.ts           # Key management
│   │   └── types.ts          # FHE type definitions
│   └── utils/                # General utilities
│       ├── security.ts       # Security functions
│       └── validation.ts     # Input validation
└── types/                    # TypeScript types
    ├── fhe.ts               # FHE types
    └── api.ts               # API types
```

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Install dependencies from the root directory:

```bash
cd ../..
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the nextjs-example directory:

```env
NEXT_PUBLIC_RPC_URL=https://devnet.zama.ai
NEXT_PUBLIC_CHAIN_ID=9000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Examples

### Basic Encryption

```tsx
import { useEncryptedInput } from '@fhevm/sdk/react';

function MyComponent() {
  const { encrypt, isEncrypting } = useEncryptedInput();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32');
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt
    </button>
  );
}
```

### Using Custom Hooks

```tsx
import { useFHE } from '../hooks/useFHE';

function MyComponent() {
  const { encrypt, isReady, client } = useFHE();

  const handleOperation = async () => {
    if (!isReady) return;

    const encrypted = await encrypt(100, 'uint32');
    // Use encrypted data with smart contracts
  };

  return <button onClick={handleOperation}>Encrypt & Submit</button>;
}
```

### Server-Side API Usage

```tsx
// Call encryption API
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    value: 42,
    type: 'uint32',
  }),
});

const { data } = await response.json();
console.log('Encrypted data:', data.encryptedData);
```

## API Routes

### `/api/fhe` - General FHE Operations

- `GET` - Get API information
- `POST` - Validate instance and get public key

### `/api/fhe/encrypt` - Encryption

- `POST` - Encrypt data server-side
  - Body: `{ value: number, type: string }`
  - Returns: Encrypted data and handles

### `/api/fhe/decrypt` - Decryption

- `POST` - Decrypt data (public decryption only)
  - Body: `{ contractAddress: string, handle: string }`
  - Returns: Decrypted value

### `/api/fhe/compute` - Computation

- `POST` - Perform homomorphic computation
  - Body: `{ operation: string, contractAddress: string, abi: any[], method: string, params?: any[] }`
  - Returns: Computation result

### `/api/keys` - Key Management

- `GET` - Get public key information
- `POST` - Refresh or validate keys
  - Body: `{ action: 'refresh' | 'validate' }`

## Components

### UI Components

- **Button** - Styled button with loading state
- **Input** - Form input with label and error handling
- **Card** - Container component with header/footer

### FHE Components

- **EncryptionDemo** - Interactive encryption demonstration
- **ComputationDemo** - Homomorphic computation examples
- **KeyManager** - FHE key management interface

### Example Components

- **BankingExample** - Confidential banking transactions
- **MedicalExample** - Private medical records management

## Custom Hooks

### `useFHE()`

Complete FHE operations hook:

```tsx
const { encrypt, getInstance, getContract, isReady } = useFHE();
```

### `useEncryption()`

Enhanced encryption with type-specific methods:

```tsx
const { encryptUint32, encryptBool, lastResult, history } = useEncryption();
```

### `useComputation()`

Homomorphic computation operations:

```tsx
const { compute, add, multiply, compare } = useComputation({
  contractAddress: '0x...',
  abi: contractABI,
});
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint for FHEVM network | `https://devnet.zama.ai` |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID for the network | `9000` |
| `NEXT_PUBLIC_GATEWAY_URL` | Gateway URL (optional) | Auto-detected |
| `NEXT_PUBLIC_ACL_ADDRESS` | ACL contract address (optional) | Auto-detected |

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy --prod
```

### Docker

```bash
docker build -t nextjs-fhevm .
docker run -p 3000:3000 nextjs-fhevm
```

## Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## Support

For issues and questions:
- Check the [FAQ](../../FAQ.md)
- Review [examples](../../examples/)
- Open an issue on GitHub

## License

MIT License - see [LICENSE](../../LICENSE) for details
