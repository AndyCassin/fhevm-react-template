import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Main entry point for the Node.js vanilla FHEVM example
 */
async function main() {
  console.log('🔐 FHEVM SDK - Node.js Vanilla Example\n');
  console.log('=========================================\n');

  try {
    // Setup provider
    const rpcUrl = process.env.RPC_URL || 'https://devnet.zama.ai';
    const provider = new JsonRpcProvider(rpcUrl);

    console.log(`📡 Connecting to: ${rpcUrl}`);

    // Create wallet if private key provided
    let signer;
    if (process.env.PRIVATE_KEY) {
      signer = new Wallet(process.env.PRIVATE_KEY, provider);
      const address = await signer.getAddress();
      console.log(`👛 Wallet address: ${address}\n`);
    } else {
      console.log('⚠️  No private key provided. Read-only mode.\n');
    }

    // Initialize FHEVM instance
    console.log('🚀 Initializing FHEVM instance...');
    const fhevmClient = await createFhevmInstance({
      provider: signer || provider,
      gatewayUrl: process.env.GATEWAY_URL,
      aclAddress: process.env.ACL_ADDRESS
    });

    console.log('✅ FHEVM instance created successfully!\n');

    // Get the instance for encryption
    const instance = fhevmClient.getInstance();
    console.log('📦 Instance ready for encryption operations\n');

    // Example: Encrypt a value
    console.log('🔒 Encrypting a sample value (42)...');
    const value = 42;
    const encrypted = await instance.encrypt32(value);

    console.log('✅ Encryption successful!');
    console.log(`   Original value: ${value}`);
    console.log(`   Encrypted data length: ${encrypted.data.length} bytes`);
    console.log(`   Encrypted data (hex): 0x${Buffer.from(encrypted.data).toString('hex').substring(0, 32)}...`);
    console.log('');

    // Display available encryption methods
    console.log('📋 Available encryption methods:');
    console.log('   - encrypt8()   : Encrypt 8-bit unsigned integer');
    console.log('   - encrypt16()  : Encrypt 16-bit unsigned integer');
    console.log('   - encrypt32()  : Encrypt 32-bit unsigned integer');
    console.log('   - encrypt64()  : Encrypt 64-bit unsigned integer');
    console.log('   - encrypt128() : Encrypt 128-bit unsigned integer');
    console.log('   - encryptBool(): Encrypt boolean value');
    console.log('   - encryptAddress(): Encrypt Ethereum address');
    console.log('');

    console.log('💡 To test specific examples, run:');
    console.log('   npm run encrypt  - Encryption examples');
    console.log('   npm run decrypt  - Decryption examples');
    console.log('   npm run contract - Contract interaction examples');
    console.log('');

    console.log('✨ Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
