import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Example ABI for a simple confidential contract
const EXAMPLE_ABI = [
  'function submitConfidentialValue(bytes calldata encryptedValue) external',
  'function getEncryptedValue() external view returns (bytes memory)',
  'event ConfidentialValueSubmitted(address indexed user, bytes32 indexed handle)'
];

/**
 * Contract interaction examples using FHEVM SDK
 */
async function contractExamples() {
  console.log('📜 FHEVM Contract Interaction Examples\n');
  console.log('=========================================\n');

  try {
    // Setup
    const provider = new JsonRpcProvider(process.env.RPC_URL || 'https://devnet.zama.ai');

    if (!process.env.PRIVATE_KEY) {
      console.error('❌ PRIVATE_KEY is required for contract interaction');
      process.exit(1);
    }

    const signer = new Wallet(process.env.PRIVATE_KEY, provider);
    const address = await signer.getAddress();
    console.log(`👛 Using wallet: ${address}\n`);

    // Initialize FHEVM
    const fhevmClient = await createFhevmInstance({ provider: signer });
    const instance = fhevmClient.getInstance();
    console.log('✅ FHEVM instance initialized\n');

    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
      console.log('⚠️  No CONTRACT_ADDRESS set. Showing workflow:\n');

      console.log('📋 Contract Interaction Workflow:');
      console.log('');
      console.log('1️⃣  Encrypt data client-side:');
      console.log('   const encrypted = await instance.encrypt32(42);');
      console.log('');
      console.log('2️⃣  Get contract instance with signer:');
      console.log('   const contract = fhevmClient.getConnectedContract(');
      console.log('     contractAddress,');
      console.log('     contractABI');
      console.log('   );');
      console.log('');
      console.log('3️⃣  Submit encrypted data to contract:');
      console.log('   const tx = await contract.submitConfidentialValue(');
      console.log('     encrypted.data');
      console.log('   );');
      console.log('   await tx.wait();');
      console.log('');
      console.log('4️⃣  Contract performs FHE operations on encrypted data');
      console.log('');
      console.log('5️⃣  Decrypt result when needed:');
      console.log('   const result = await useUserDecrypt({');
      console.log('     contractAddress,');
      console.log('     handle: resultHandle,');
      console.log('     signer');
      console.log('   });');
      console.log('');

      // Demonstrate encryption that would be sent to contract
      console.log('🔒 Example: Encrypting value for contract submission...\n');
      const valueToEncrypt = 12345;
      console.log(`   Original value: ${valueToEncrypt}`);

      const encrypted = await instance.encrypt32(valueToEncrypt);
      console.log(`   Encrypted data: ${encrypted.data.length} bytes`);
      console.log(`   Hex preview: 0x${Buffer.from(encrypted.data).toString('hex').substring(0, 64)}...`);
      console.log('');
      console.log('   This encrypted data would be sent to the smart contract');
      console.log('   The contract can perform operations on it while encrypted!');
      console.log('');

      console.log('💡 Set CONTRACT_ADDRESS in .env to test real contract interaction');
      return;
    }

    // Get contract instance
    console.log(`📜 Contract address: ${contractAddress}\n`);
    const contract = fhevmClient.getConnectedContract(contractAddress, EXAMPLE_ABI);

    // Encrypt a value
    console.log('1️⃣  Encrypting value to submit...');
    const secretValue = 42;
    const encrypted = await instance.encrypt32(secretValue);
    console.log(`   Value: ${secretValue}`);
    console.log(`   Encrypted: ${encrypted.data.length} bytes\n`);

    // Submit to contract
    console.log('2️⃣  Submitting encrypted value to contract...');
    try {
      const tx = await contract.submitConfidentialValue(encrypted.data);
      console.log(`   Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`   ✅ Confirmed in block ${receipt.blockNumber}\n`);

      // Check for events
      if (receipt.logs.length > 0) {
        console.log(`   📨 ${receipt.logs.length} event(s) emitted`);
      }
    } catch (error) {
      console.log(`   ⚠️  ${error.message}\n`);
    }

    // Read from contract (example)
    console.log('3️⃣  Reading from contract...');
    try {
      const encryptedValue = await contract.getEncryptedValue();
      console.log(`   ✅ Retrieved encrypted value: ${encryptedValue.length} bytes\n`);
    } catch (error) {
      console.log(`   ⚠️  ${error.message}\n`);
    }

    console.log('✅ Contract interaction examples completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

contractExamples().catch(console.error);
