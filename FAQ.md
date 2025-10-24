# Frequently Asked Questions (FAQ)

## General Questions

### What is FHEVM SDK?

FHEVM SDK is a universal, framework-agnostic software development kit that simplifies building confidential frontends with Fully Homomorphic Encryption (FHE). It wraps all necessary FHEVM packages and provides a clean, wagmi-like API for web3 developers.

### What makes this SDK "framework-agnostic"?

The core SDK has zero framework dependencies and can be used in:
- Node.js applications
- Next.js projects
- React applications
- Vue.js applications
- Vanilla JavaScript websites
- Any JavaScript/TypeScript environment

### How is this different from using fhevmjs directly?

FHEVM SDK provides:
- Simplified initialization (no manual setup)
- Higher-level abstractions
- React hooks for easy integration
- Better TypeScript support
- Consistent error handling
- Production-ready patterns

## Installation & Setup

### How do I install the SDK?

From the root of this repository:
```bash
npm install
```

To use in your own project (once published):
```bash
npm install @fhevm/sdk ethers
```

### What are the minimum requirements?

- Node.js 18+ or 20+
- npm 9+ or yarn 1.22+
- MetaMask or compatible Web3 wallet
- Basic understanding of Ethereum and Web3

### How do I get started quickly?

1. Clone the repository
2. Run `npm install`
3. Start the Next.js example: `npm run dev:nextjs`
4. Open http://localhost:3000
5. Connect your wallet and try encrypting data

## Usage Questions

### How do I initialize the SDK?

**Vanilla JavaScript/TypeScript:**
```typescript
import { createFhevmInstance } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const fhevm = await createFhevmInstance({ provider });
```

**React:**
```tsx
import { FhevmProvider } from '@fhevm/sdk/react';

function App() {
  return (
    <FhevmProvider provider={provider}>
      <YourApp />
    </FhevmProvider>
  );
}
```

### How do I encrypt data?

**Vanilla JavaScript:**
```typescript
const instance = fhevm.getInstance();
const encrypted = await instance.encrypt32(42);
```

**React Hook:**
```typescript
const { encrypt } = useEncryptedInput();
const encrypted = await encrypt(42, 'uint32');
```

### What encryption types are supported?

- `uint8`, `uint16`, `uint32`, `uint64`, `uint128`
- `bool`
- `address`

### How do I interact with smart contracts?

**Vanilla JavaScript:**
```typescript
const contract = await fhevm.getConnectedContract(address, abi);
await contract.myFunction(encrypted.data, encrypted.handles);
```

**React Hook:**
```typescript
const contract = useFhevmContract({
  address: '0x...',
  abi: myABI,
  withSigner: true
});
await contract.myFunction(encrypted.data, encrypted.handles);
```

### How do I decrypt data?

**User Decryption (requires signature):**
```typescript
import { useUserDecrypt } from '@fhevm/sdk';

const result = await useUserDecrypt({
  contractAddress,
  handle,
  signer
});
```

**Public Decryption:**
```typescript
import { usePublicDecrypt } from '@fhevm/sdk';

const result = await usePublicDecrypt(contractAddress, handle);
```

## Development Questions

### Can I use this with Next.js 14 App Router?

Yes! Check the `examples/nextjs-example/` directory for a complete implementation using Next.js 14 with App Router.

### Can I use this with Vue.js?

Yes, the core SDK is framework-agnostic. While we don't provide Vue composables yet, you can use the core SDK directly:

```javascript
import { createFhevmInstance } from '@fhevm/sdk';

export default {
  async mounted() {
    const fhevm = await createFhevmInstance({ provider });
    this.fhevm = fhevm;
  }
}
```

### Does it work with TypeScript?

Yes! The SDK is written in TypeScript and includes full type definitions.

### How do I handle errors?

**Vanilla JavaScript:**
```typescript
try {
  const encrypted = await instance.encrypt32(value);
} catch (error) {
  console.error('Encryption failed:', error);
}
```

**React Hook:**
```typescript
const { encrypt, error } = useEncryptedInput();
if (error) {
  // Handle error
}
```

## Deployment Questions

### How do I deploy the Next.js example?

See `DEPLOYMENT.md` for detailed instructions. Quick version:

```bash
cd examples/nextjs-example
vercel deploy --prod
```

### How do I deploy smart contracts?

```bash
cd examples/patent-license
npm run compile
npm run deploy
npm run verify
```

### What networks are supported?

Currently configured for:
- Sepolia Testnet (for testing)
- Can be configured for any EVM-compatible network
- Ethereum Mainnet (requires FHEVM support)

### Do I need a special RPC provider?

You need an Ethereum RPC provider (Alchemy, Infura, etc.) and access to the FHEVM Gateway for encryption/decryption operations.

## Technical Questions

### How does FHE encryption work?

Fully Homomorphic Encryption (FHE) allows computations on encrypted data without decrypting it. The SDK handles all the complexity of:
1. Generating encryption keys
2. Encrypting data client-side
3. Sending encrypted data to contracts
4. Decrypting results when needed

### What's the difference between user and public decryption?

**User Decryption**:
- Requires EIP-712 signature
- User-specific decryption
- Private to the signer

**Public Decryption**:
- No signature required
- Anyone can decrypt
- For publicly visible data

### Is the encrypted data stored on-chain?

Yes, encrypted data is stored on the blockchain. The encryption ensures privacy even though the data is publicly visible.

### What are gas costs like?

FHE operations are more expensive than regular operations due to computational complexity. Costs vary by:
- Encryption type (uint8 vs uint128)
- Number of operations
- Network gas prices

Test on Sepolia testnet first to estimate costs.

## Troubleshooting

### "FHEVM instance not initialized" error

Make sure you:
1. Call `createFhevmInstance()` before using the instance
2. Wait for initialization to complete (it's async)
3. In React, ensure the provider is initialized

### MetaMask not connecting

Check that:
1. MetaMask is installed
2. You're on the correct network (Sepolia for examples)
3. Your wallet has some test ETH
4. Pop-up blocker isn't blocking MetaMask

### Encryption fails

Verify:
1. FHEVM instance is initialized
2. Gateway URL is correct
3. Network connectivity is working
4. Value is within valid range for the type

### Contract deployment fails

Common issues:
1. Insufficient funds - get Sepolia ETH from faucet
2. Wrong network - check MetaMask network
3. RPC URL issues - verify in `.env`

### TypeScript errors

Run:
```bash
npm run typecheck
```

Make sure:
1. Dependencies are installed
2. TypeScript version is 5.3+
3. Check `tsconfig.json` configuration

## Performance Questions

### How fast is encryption?

Encryption speed depends on:
- Data type (uint8 is faster than uint128)
- Browser/environment performance
- Network conditions for gateway communication

Typical encryption takes 100-500ms.

### Can I encrypt multiple values at once?

Currently, encrypt values individually. Batch encryption may be added in future versions.

### Does it work offline?

No, encryption requires connection to the FHEVM Gateway. Consider implementing queue functionality for offline scenarios.

## Contributing Questions

### How can I contribute?

See `CONTRIBUTING.md` for detailed guidelines. Quick steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Can I add support for another framework?

Yes! We welcome framework integrations. Consider adding:
- Vue composables
- Svelte stores
- Angular services

### How do I report bugs?

Open a GitHub issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## License Questions

### What license is this under?

MIT License - see `LICENSE` file.

### Can I use this commercially?

Yes, the MIT license allows commercial use.

### Do I need to credit the SDK?

Not required, but appreciated! Consider adding:
```markdown
Built with [FHEVM SDK](https://github.com/your-repo)
```

## Support

### Where can I get help?

- Read the documentation in `README.md`
- Check this FAQ
- Open a GitHub Issue
- Review example code in `examples/`

### Is there a community?

- GitHub Discussions (coming soon)
- Zama Community Discord
- Stack Overflow (tag: fhevm)

### How do I stay updated?

- Star the GitHub repository
- Watch for releases
- Follow Zama on Twitter

---

**Still have questions? Open a GitHub Issue!**
