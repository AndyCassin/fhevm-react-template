import { createFhevmInstance, encryptInput } from '@fhevm/sdk';
import type { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider, JsonRpcProvider } from 'ethers';

/**
 * Client-side FHE operations
 * Handles encryption and FHE client management on the browser
 */

let fhevmClientInstance: FhevmClient | null = null;

/**
 * Initialize FHEVM client for browser
 */
export async function initializeFhevmClient(
  provider: BrowserProvider | JsonRpcProvider,
  options?: {
    chainId?: number;
    gatewayUrl?: string;
    aclAddress?: string;
  }
): Promise<FhevmClient> {
  if (fhevmClientInstance) {
    return fhevmClientInstance;
  }

  try {
    fhevmClientInstance = await createFhevmInstance({
      provider,
      ...options,
    });

    return fhevmClientInstance;
  } catch (error) {
    console.error('Failed to initialize FHEVM client:', error);
    throw error;
  }
}

/**
 * Get the current FHEVM client instance
 */
export function getFhevmClient(): FhevmClient {
  if (!fhevmClientInstance) {
    throw new Error('FHEVM client not initialized. Call initializeFhevmClient first.');
  }
  return fhevmClientInstance;
}

/**
 * Reset the FHEVM client instance
 */
export function resetFhevmClient(): void {
  fhevmClientInstance = null;
}

/**
 * Encrypt data using the FHEVM client
 */
export async function encryptData(
  value: number | boolean,
  type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'address'
) {
  const client = getFhevmClient();
  const instance = client.getInstance();

  return await encryptInput(instance, value, type);
}

/**
 * Get contract instance for reading
 */
export function getContract(address: string, abi: any[]) {
  const client = getFhevmClient();
  return client.getContract(address, abi);
}

/**
 * Get contract instance with signer for writing
 */
export function getConnectedContract(address: string, abi: any[]) {
  const client = getFhevmClient();
  return client.getConnectedContract(address, abi);
}

/**
 * Check if FHEVM client is initialized
 */
export function isClientInitialized(): boolean {
  return fhevmClientInstance !== null;
}
