# Project Structure

This document provides an overview of the complete project structure.

## Root Directory

```
fhevm-react-template/
├── packages/                    # SDK packages
│   └── fhevm-sdk/              # Core FHEVM SDK
├── examples/                    # Example applications
│   ├── nextjs-example/         # Next.js 14 example (required)
│   ├── patent-license/         # Patent license dApp (bonus)
│   └── node-vanilla/           # Vanilla Node.js example (future)
├── docs/                       # Additional documentation (future)
├── .gitignore                  # Git ignore file
├── LICENSE                     # MIT License
├── README.md                   # Main documentation
├── QUICKSTART.md              # Quick start guide
├── DEPLOYMENT.md              # Deployment instructions
├── ARCHITECTURE.md            # Architecture documentation
├── CONTRIBUTING.md            # Contribution guidelines
├── FAQ.md                     # Frequently asked questions
├── DEMO_VIDEO.md             # Demo video instructions
├── DEMO_README.txt           # Demo placeholder
├── SUBMISSION_SUMMARY.md     # Bounty submission summary
└── package.json              # Root package.json (workspace)
```

## SDK Package (`packages/fhevm-sdk/`)

```
fhevm-sdk/
├── src/
│   ├── index.ts              # Main exports
│   ├── client.ts             # FhevmClient class
│   ├── instance.ts           # Instance creation utilities
│   ├── encryption.ts         # Encryption helpers
│   ├── decrypt.ts            # Decryption utilities
│   ├── types.ts              # TypeScript type definitions
│   ├── config/
│   │   └── chains.ts         # Chain configurations
│   └── react/                # React integration
│       ├── index.ts          # React exports
│       ├── FhevmProvider.tsx # Context provider
│       ├── useFhevmClient.ts # Client hook
│       ├── useFhevmContract.ts # Contract hook
│       ├── useEncryptedInput.ts # Encryption hook
│       └── useDecrypt.ts     # Decryption hook
├── dist/                     # Built files (generated)
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript config
└── README.md                 # SDK documentation
```

## Next.js Example (`examples/nextjs-example/`)

```
nextjs-example/
├── app/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── providers.tsx         # FHEVM Provider setup
│   └── globals.css           # Global styles
├── public/                   # Static assets
├── .env.local.example        # Environment variables template
├── next.config.js            # Next.js configuration
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Package configuration
└── README.md                 # Next.js example documentation
```

## Patent License Example (`examples/patent-license/`)

```
patent-license/
├── contracts/
│   └── ConfidentialPatentLicense.sol # Main smart contract
├── scripts/
│   ├── deploy.js             # Deployment script
│   └── verify.js             # Verification script
├── test/                     # Contract tests (optional)
├── cache/                    # Hardhat cache (generated)
├── artifacts/                # Compiled contracts (generated)
├── index.html                # Frontend application
├── hardhat.config.js         # Hardhat configuration
├── .env.example              # Environment variables template
├── package.json              # Package configuration
└── README.md                 # Patent license documentation
```

## Key Files Explained

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation and quick start |
| `package.json` | Workspace configuration, links all packages |
| `QUICKSTART.md` | 5-minute setup guide |
| `DEPLOYMENT.md` | Complete deployment instructions |
| `ARCHITECTURE.md` | Detailed architecture documentation |
| `CONTRIBUTING.md` | Guidelines for contributors |
| `FAQ.md` | Answers to common questions |
| `SUBMISSION_SUMMARY.md` | Bounty submission overview |
| `LICENSE` | MIT License text |
| `.gitignore` | Git ignore patterns |

### SDK Package

| File | Purpose |
|------|---------|
| `src/index.ts` | Main SDK exports |
| `src/client.ts` | Core FhevmClient class |
| `src/encryption.ts` | Encryption utilities |
| `src/decrypt.ts` | Decryption utilities |
| `src/types.ts` | TypeScript type definitions |
| `src/react/index.ts` | React hooks exports |
| `package.json` | SDK package configuration |
| `README.md` | SDK API reference |

### Next.js Example

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with providers |
| `app/page.tsx` | Main page with encryption demo |
| `app/providers.tsx` | FHEVM Provider initialization |
| `app/globals.css` | Global styles |
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS setup |
| `package.json` | Dependencies and scripts |

### Patent License Example

| File | Purpose |
|------|---------|
| `contracts/ConfidentialPatentLicense.sol` | Smart contract |
| `scripts/deploy.js` | Deployment script |
| `scripts/verify.js` | Etherscan verification |
| `index.html` | Frontend UI |
| `hardhat.config.js` | Hardhat setup |
| `.env.example` | Environment variables template |

## File Naming Conventions

### Documentation
- `UPPERCASE.md` - Important documentation files
- `README.md` - Package/example specific documentation

### Source Code
- `camelCase.ts` - TypeScript source files
- `PascalCase.tsx` - React component files
- `kebab-case.js` - JavaScript files
- `PascalCase.sol` - Solidity contracts

### Configuration
- `lowercase.config.js` - Configuration files
- `.lowercase` - Hidden config files
- `.env.example` - Environment templates

## Important Directories

### Generated/Build Directories (Not Committed)

```
node_modules/          # Dependencies (all levels)
dist/                  # Built SDK files
.next/                 # Next.js build output
cache/                 # Hardhat cache
artifacts/             # Compiled contracts
coverage/              # Test coverage reports
```

These are listed in `.gitignore` and should not be committed.

### Source Directories

```
src/                   # SDK source code
app/                   # Next.js app directory
contracts/             # Solidity contracts
scripts/               # Deployment and utility scripts
```

## Workspace Structure

This is a monorepo using npm workspaces:

```json
{
  "workspaces": [
    "packages/*",
    "examples/*"
  ]
}
```

Benefits:
- Shared dependencies
- Easy cross-package imports
- Single `npm install` for everything
- Consistent tooling

## Module Resolution

### SDK Import Paths

From any example:
```typescript
import { createFhevmInstance } from '@fhevm/sdk';
import { useFhevm } from '@fhevm/sdk/react';
```

### Internal Imports (within SDK)

```typescript
// Absolute imports from src/
import { FhevmClient } from './client';
import { encryptInput } from './encryption';
```

## Build Output

### SDK Build

```
packages/fhevm-sdk/dist/
├── index.js              # CommonJS bundle
├── index.mjs             # ES Module bundle
├── index.d.ts            # TypeScript definitions
├── react/
│   ├── index.js
│   ├── index.mjs
│   └── index.d.ts
└── ...
```

### Next.js Build

```
examples/nextjs-example/.next/
├── server/               # Server-side code
├── static/               # Static assets
└── ...
```

## Development Workflow

1. **Root Level**: `npm install`
2. **SDK Development**: `npm run dev:sdk`
3. **Example Testing**:
   - `npm run dev:nextjs`
   - `npm run dev:patent`
4. **Building**: `npm run build`
5. **Testing**: `npm test`

## Adding New Files

### New SDK Feature

1. Create file in `packages/fhevm-sdk/src/`
2. Export from `packages/fhevm-sdk/src/index.ts`
3. Add types to `packages/fhevm-sdk/src/types.ts`
4. Update `packages/fhevm-sdk/README.md`

### New Example

1. Create directory in `examples/`
2. Add to workspace in root `package.json`
3. Create example-specific `README.md`
4. Add run script to root `package.json`

### New Documentation

1. Create `.md` file in root
2. Add link in main `README.md`
3. Update table of contents

## Quick Reference

| Need to... | Go to... |
|------------|----------|
| Understand the SDK | `packages/fhevm-sdk/README.md` |
| See Next.js usage | `examples/nextjs-example/` |
| See contract example | `examples/patent-license/` |
| Deploy to production | `DEPLOYMENT.md` |
| Contribute code | `CONTRIBUTING.md` |
| Get help | `FAQ.md` |
| Understand architecture | `ARCHITECTURE.md` |
| Quick start | `QUICKSTART.md` |

---

**This structure is designed for clarity, maintainability, and ease of use.**
