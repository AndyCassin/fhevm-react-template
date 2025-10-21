# Deployment Guide

This guide covers deploying the FHEVM SDK and example applications to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [SDK Package Deployment](#sdk-package-deployment)
3. [Next.js Example Deployment](#nextjs-example-deployment)
4. [Patent License Example Deployment](#patent-license-example-deployment)
5. [Smart Contract Deployment](#smart-contract-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ or 20+
- npm 9+ or yarn 1.22+
- Git installed
- MetaMask wallet with Sepolia ETH
- Alchemy or Infura account for RPC access
- Etherscan API key (for contract verification)
- Vercel/Netlify account (for frontend hosting)

## SDK Package Deployment

### Publishing to npm (Optional)

If you want to publish the SDK to npm:

```bash
cd packages/fhevm-sdk
npm run build
npm login
npm publish --access public
```

### Local Development

For local testing across examples:

```bash
# From root directory
npm install
npm run build:sdk
```

This builds the SDK and makes it available to all examples via workspace linking.

## Next.js Example Deployment

### Deploy to Vercel (Recommended)

Vercel provides the best Next.js deployment experience:

#### Method 1: CLI Deployment

```bash
cd examples/nextjs-example

# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Method 2: Git Integration

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `examples/nextjs-example`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variables (see [Environment Configuration](#environment-configuration))
7. Click "Deploy"

#### Build Configuration

Vercel will automatically detect Next.js. Ensure your `package.json` has:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### Deploy to Netlify

```bash
cd examples/nextjs-example

# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Build and deploy
npm run build
netlify deploy --prod
```

#### Netlify Configuration

Create `netlify.toml` in the example directory:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Deploy to Other Platforms

For other platforms (AWS, Azure, Google Cloud):

```bash
# Build the application
npm run build

# The build output will be in .next/
# Deploy the .next folder along with:
# - package.json
# - package-lock.json
# - next.config.js
# - public/

# On the server, run:
npm install --production
npm start
```

## Patent License Example Deployment

The Patent License example is a static HTML application with smart contracts.

### Deploy Smart Contracts

See [Smart Contract Deployment](#smart-contract-deployment) section.

### Deploy Frontend

#### GitHub Pages

```bash
cd examples/patent-license

# Build is not needed (static HTML)
# Push to GitHub

# In GitHub repository settings:
# 1. Go to Pages
# 2. Source: Deploy from a branch
# 3. Branch: main, /examples/patent-license
# 4. Save
```

#### Vercel

```bash
cd examples/patent-license
vercel --prod
```

Vercel configuration:

- **Framework Preset**: Other
- **Build Command**: (leave empty)
- **Output Directory**: `.` (current directory)

#### Netlify

```bash
cd examples/patent-license
netlify deploy --prod --dir .
```

#### Using http-server Locally

For local deployment:

```bash
npm start
# Opens at http://localhost:3001
```

### Update Contract Address

After deploying contracts, update the `CONTRACT_ADDRESS` in `index.html`:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

## Smart Contract Deployment

### Deploy to Sepolia Testnet

1. **Setup Environment**

Create `.env` file in `examples/patent-license/`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. **Get Sepolia ETH**

Get testnet ETH from:
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)

3. **Compile Contracts**

```bash
cd examples/patent-license
npm run compile
```

4. **Deploy**

```bash
npm run deploy
```

Save the deployed contract address from the output.

5. **Verify on Etherscan**

```bash
npm run verify
```

### Deploy to Mainnet

⚠️ **Warning**: Mainnet deployment requires real ETH and should only be done after thorough testing.

1. Update `hardhat.config.js` with mainnet configuration:

```javascript
mainnet: {
  url: process.env.MAINNET_RPC_URL,
  accounts: [process.env.MAINNET_PRIVATE_KEY],
  chainId: 1,
}
```

2. Deploy:

```bash
npm run deploy --network mainnet
```

3. Verify:

```bash
npm run verify --network mainnet
```

## Environment Configuration

### Next.js Example Environment Variables

Create `.env.local` in `examples/nextjs-example/`:

```env
# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=11155111

# FHEVM Gateway
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Patent License Environment Variables

Create `.env` in `examples/patent-license/`:

```env
# Deployment
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract (after deployment)
CONTRACT_ADDRESS=0xYourDeployedAddress
```

### Vercel Environment Variables

Add in Vercel Dashboard:

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add each variable:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_GATEWAY_URL`

### Netlify Environment Variables

Add in Netlify Dashboard:

1. Site Settings > Build & Deploy > Environment
2. Click "Edit variables"
3. Add each variable

## Post-Deployment Checklist

### Next.js Example

- [ ] Verify application loads correctly
- [ ] Test wallet connection with MetaMask
- [ ] Verify FHEVM SDK initialization
- [ ] Test encryption functionality
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify SSL certificate (HTTPS)

### Patent License Example

- [ ] Confirm contract is deployed and verified
- [ ] Update CONTRACT_ADDRESS in frontend
- [ ] Test all contract interactions:
  - [ ] Patent registration
  - [ ] License requests
  - [ ] Bidding system
  - [ ] Royalty payments
- [ ] Verify encryption/decryption works
- [ ] Check gas costs are reasonable

### Smart Contracts

- [ ] Contract verified on Etherscan
- [ ] Contract ownership is correct
- [ ] Test all functions on testnet
- [ ] Document contract addresses
- [ ] Set up contract monitoring (optional)

## Continuous Deployment

### GitHub Actions for Next.js

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'examples/nextjs-example/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build:nextjs
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./examples/nextjs-example
```

### GitHub Actions for Contract Deployment

```yaml
name: Deploy Contracts

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd examples/patent-license && npm install
      - run: cd examples/patent-license && npm run compile
      - run: cd examples/patent-license && npm run deploy
        env:
          SEPOLIA_RPC_URL: ${{ secrets.SEPOLIA_RPC_URL }}
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

## Troubleshooting

### Build Failures

**Issue**: Next.js build fails with module errors

**Solution**:
```bash
# Clear all caches
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Contract Deployment Fails

**Issue**: "Insufficient funds" error

**Solution**:
- Ensure wallet has enough Sepolia ETH
- Check gas price settings in `hardhat.config.js`

**Issue**: "Nonce too low" error

**Solution**:
- Reset MetaMask account in settings
- Or wait a few minutes and retry

### Frontend Can't Connect to Contract

**Issue**: MetaMask shows wrong network

**Solution**:
- Switch MetaMask to Sepolia network
- Verify CHAIN_ID in environment variables

**Issue**: "Contract not deployed" error

**Solution**:
- Verify CONTRACT_ADDRESS is correct
- Check contract is deployed: `npx hardhat verify --network sepolia ADDRESS`

### FHEVM SDK Issues

**Issue**: "Instance not initialized"

**Solution**:
- Ensure provider is connected before creating FHEVM instance
- Check browser console for initialization errors

**Issue**: Encryption fails

**Solution**:
- Verify FHEVM gateway URL is correct
- Check network connectivity
- Ensure contract supports FHEVM operations

## Security Considerations

### Production Deployment

- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable SSL/HTTPS
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Use secure RPC providers
- [ ] Audit smart contracts before mainnet
- [ ] Monitor contract for unusual activity

### API Keys and Secrets

- Store in environment variables
- Use secret management services (AWS Secrets Manager, etc.)
- Rotate keys regularly
- Use different keys for staging/production

## Monitoring and Maintenance

### Frontend Monitoring

Use services like:
- Vercel Analytics
- Google Analytics
- Sentry for error tracking

### Contract Monitoring

- Use Etherscan to monitor transactions
- Set up alerts for critical events
- Monitor gas costs
- Track contract balance

## Rollback Procedures

### Frontend Rollback

Vercel:
```bash
vercel rollback
```

Or redeploy previous Git commit:
```bash
git checkout PREVIOUS_COMMIT
vercel --prod
```

### Contract Rollback

⚠️ Smart contracts cannot be rolled back. Options:
1. Deploy new version with fixes
2. Use upgradeable contract pattern (if implemented)
3. Pause contract if emergency function exists

## Support

For deployment issues:
- Check GitHub Issues
- Review Vercel/Netlify documentation
- Consult Hardhat documentation
- Contact FHEVM support

---

**Always test thoroughly on testnets before mainnet deployment!**
