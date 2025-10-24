# Next.js FHEVM SDK Example

This example demonstrates how to integrate the FHEVM SDK with Next.js 14 using the App Router.

## Features

- **Next.js 14 App Router** - Modern Next.js architecture
- **FHEVM SDK Integration** - Full SDK usage with React hooks
- **Wallet Connection** - MetaMask integration
- **Encrypted Forms** - Submit confidential data to smart contracts
- **TypeScript** - Fully typed implementation
- **Tailwind CSS** - Modern styling

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- MetaMask browser extension
- Ethereum Sepolia testnet access

### Installation

From the root directory:

```bash
npm install
```

Or from this directory:

```bash
cd examples/nextjs-example
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs-example/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # FHEVM Provider setup
│   └── components/
│       ├── WalletConnect.tsx
│       ├── EncryptedForm.tsx
│       └── DecryptionDemo.tsx
├── public/
├── package.json
└── README.md
```

## Usage

### 1. Connect Wallet

Click the "Connect Wallet" button to connect your MetaMask wallet.

### 2. Encrypt Data

Use the form to encrypt confidential data:

```tsx
import { useEncryptedInput } from '@fhevm/sdk/react';

function EncryptedForm() {
  const { encrypt, isEncrypting } = useEncryptedInput();

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint32');
    // Use encrypted.data and encrypted.handles with your contract
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(42);
    }}>
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### 3. Interact with Contracts

```tsx
import { useFhevmContract } from '@fhevm/sdk/react';

function ContractInteraction() {
  const contract = useFhevmContract({
    address: '0x...',
    abi: myABI,
    withSigner: true
  });

  const submitData = async (encrypted: any) => {
    const tx = await contract.submitConfidentialData(
      encrypted.data,
      encrypted.handles
    );
    await tx.wait();
  };

  return <button onClick={() => submitData(...)}>Submit to Contract</button>;
}
```

### 4. Decrypt Results

```tsx
import { useDecrypt } from '@fhevm/sdk/react';

function DecryptionDemo() {
  const { decrypt, isDecrypting, result } = useDecrypt();

  const handleDecrypt = async () => {
    await decrypt(contractAddress, encryptedHandle);
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai
```

### Tailwind Configuration

The project uses Tailwind CSS for styling. Customize `tailwind.config.js` as needed.

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy --prod
```

### Other Platforms

```bash
npm run build
npm start
```

Then deploy the `.next` folder to your hosting platform.

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## License

MIT
