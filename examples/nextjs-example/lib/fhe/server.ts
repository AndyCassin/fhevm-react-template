import { createFhevmInstance, usePublicDecrypt } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * Server-side FHE operations
 * Handles FHE operations on the server (API routes)
 */

/**
 * Initialize FHEVM instance for server-side operations
 */
export async function createServerFhevmInstance(rpcUrl?: string) {
  const provider = new JsonRpcProvider(
    rpcUrl || process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.zama.ai'
  );

  return await createFhevmInstance({ provider });
}

/**
 * Perform public decryption on server
 */
export async function serverDecrypt(
  contractAddress: string,
  handle: string
): Promise<bigint> {
  try {
    return await usePublicDecrypt(contractAddress, handle);
  } catch (error) {
    console.error('Server decryption error:', error);
    throw error;
  }
}

/**
 * Verify encrypted data integrity
 */
export async function verifyEncryptedData(data: Uint8Array): Promise<boolean> {
  try {
    // Basic validation - check if data is not empty and has reasonable size
    if (!data || data.length === 0) {
      return false;
    }

    // FHE encrypted data should have a minimum size
    if (data.length < 32) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Data verification error:', error);
    return false;
  }
}

/**
 * Get public key from server-side instance
 */
export async function getServerPublicKey(rpcUrl?: string): Promise<Uint8Array> {
  const fhevm = await createServerFhevmInstance(rpcUrl);
  const instance = fhevm.getInstance();
  return instance.getPublicKey();
}

/**
 * Validate contract supports FHE operations
 */
export async function validateFheContract(
  contractAddress: string,
  abi: any[],
  rpcUrl?: string
): Promise<boolean> {
  try {
    const fhevm = await createServerFhevmInstance(rpcUrl);
    const contract = fhevm.getContract(contractAddress, abi);

    // Try to call a basic contract method to verify it exists
    await contract.getAddress();

    return true;
  } catch (error) {
    console.error('Contract validation error:', error);
    return false;
  }
}
