import { createFhevmInstance, useUserDecrypt, usePublicDecrypt } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Decryption examples demonstrating user and public decryption
 */
async function decryptionExamples() {
  console.log('🔓 FHEVM Decryption Examples\n');
  console.log('================================\n');

  try {
    // Setup
    const provider = new JsonRpcProvider(process.env.RPC_URL || 'https://devnet.zama.ai');

    if (!process.env.PRIVATE_KEY) {
      console.error('❌ PRIVATE_KEY is required for decryption examples');
      process.exit(1);
    }

    const signer = new Wallet(process.env.PRIVATE_KEY, provider);
    const address = await signer.getAddress();
    console.log(`👛 Using wallet: ${address}\n`);

    const fhevmClient = await createFhevmInstance({ provider: signer });
    console.log('✅ FHEVM instance initialized\n');

    // For decryption examples, we need a contract address and handle
    // These would typically come from a smart contract interaction
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
      console.log('⚠️  No CONTRACT_ADDRESS set. Showing decryption workflow:\n');

      console.log('📋 User Decryption (EIP-712):');
      console.log('   1. Request decryption permission via EIP-712 signature');
      console.log('   2. User signs the permission request');
      console.log('   3. Gateway decrypts the value');
      console.log('   4. Decrypted value returned to user\n');

      console.log('   Example code:');
      console.log('   ```javascript');
      console.log('   const result = await useUserDecrypt({');
      console.log('     contractAddress: "0x...",');
      console.log('     handle: encryptedDataHandle,');
      console.log('     signer: yourSigner');
      console.log('   });');
      console.log('   console.log("Decrypted value:", result);');
      console.log('   ```\n');

      console.log('📋 Public Decryption:');
      console.log('   1. Request public decryption (no signature required)');
      console.log('   2. Gateway decrypts the value');
      console.log('   3. Decrypted value returned\n');

      console.log('   Example code:');
      console.log('   ```javascript');
      console.log('   const result = await usePublicDecrypt(');
      console.log('     contractAddress,');
      console.log('     handle');
      console.log('   );');
      console.log('   console.log("Decrypted value:", result);');
      console.log('   ```\n');

      console.log('💡 Set CONTRACT_ADDRESS in .env to test real decryption');
      return;
    }

    // Example handle (would come from contract)
    const exampleHandle = '0x1234567890abcdef';

    console.log('1️⃣  User Decryption Example...');
    console.log(`   Contract: ${contractAddress}`);
    console.log(`   Handle: ${exampleHandle}`);

    try {
      const userDecrypted = await useUserDecrypt({
        contractAddress,
        handle: exampleHandle,
        signer
      });
      console.log(`   ✅ Decrypted value: ${userDecrypted}\n`);
    } catch (error) {
      console.log(`   ⚠️  ${error.message}\n`);
    }

    console.log('2️⃣  Public Decryption Example...');
    console.log(`   Contract: ${contractAddress}`);
    console.log(`   Handle: ${exampleHandle}`);

    try {
      const publicDecrypted = await usePublicDecrypt(contractAddress, exampleHandle);
      console.log(`   ✅ Decrypted value: ${publicDecrypted}\n`);
    } catch (error) {
      console.log(`   ⚠️  ${error.message}\n`);
    }

    console.log('✅ Decryption examples completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

decryptionExamples().catch(console.error);
