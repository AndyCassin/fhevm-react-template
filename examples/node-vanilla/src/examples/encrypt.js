import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Encryption examples demonstrating different data types
 */
async function encryptionExamples() {
  console.log('🔒 FHEVM Encryption Examples\n');
  console.log('================================\n');

  try {
    // Setup
    const provider = new JsonRpcProvider(process.env.RPC_URL || 'https://devnet.zama.ai');
    const signer = process.env.PRIVATE_KEY
      ? new Wallet(process.env.PRIVATE_KEY, provider)
      : provider;

    const fhevmClient = await createFhevmInstance({ provider: signer });
    const instance = fhevmClient.getInstance();

    console.log('✅ FHEVM instance initialized\n');

    // Example 1: Encrypt boolean
    console.log('1️⃣  Encrypting boolean value...');
    const boolValue = true;
    const encryptedBool = await instance.encryptBool(boolValue);
    console.log(`   Original: ${boolValue}`);
    console.log(`   Encrypted: ${encryptedBool.data.length} bytes\n`);

    // Example 2: Encrypt uint8
    console.log('2️⃣  Encrypting uint8 value...');
    const uint8Value = 255;
    const encryptedUint8 = await instance.encrypt8(uint8Value);
    console.log(`   Original: ${uint8Value}`);
    console.log(`   Encrypted: ${encryptedUint8.data.length} bytes\n`);

    // Example 3: Encrypt uint16
    console.log('3️⃣  Encrypting uint16 value...');
    const uint16Value = 65535;
    const encryptedUint16 = await instance.encrypt16(uint16Value);
    console.log(`   Original: ${uint16Value}`);
    console.log(`   Encrypted: ${encryptedUint16.data.length} bytes\n`);

    // Example 4: Encrypt uint32
    console.log('4️⃣  Encrypting uint32 value...');
    const uint32Value = 123456789;
    const encryptedUint32 = await instance.encrypt32(uint32Value);
    console.log(`   Original: ${uint32Value}`);
    console.log(`   Encrypted: ${encryptedUint32.data.length} bytes\n`);

    // Example 5: Encrypt uint64
    console.log('5️⃣  Encrypting uint64 value...');
    const uint64Value = BigInt('9876543210123456789');
    const encryptedUint64 = await instance.encrypt64(uint64Value);
    console.log(`   Original: ${uint64Value}`);
    console.log(`   Encrypted: ${encryptedUint64.data.length} bytes\n`);

    // Example 6: Encrypt Ethereum address
    console.log('6️⃣  Encrypting Ethereum address...');
    const address = '0x1234567890123456789012345678901234567890';
    const encryptedAddress = await instance.encryptAddress(address);
    console.log(`   Original: ${address}`);
    console.log(`   Encrypted: ${encryptedAddress.data.length} bytes\n`);

    console.log('✅ All encryption examples completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

encryptionExamples().catch(console.error);
