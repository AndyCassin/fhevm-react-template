import { useState, useEffect } from 'react';
import { useFhevmClient, useEncryptedInput } from '@fhevm/sdk/react';
import type { FhevmClient } from '@fhevm/sdk';

/**
 * Custom hook for complete FHE operations
 * Provides a simplified interface for encryption, decryption, and FHE operations
 */
export const useFHE = () => {
  const { client, isLoading, isReady, error: clientError } = useFhevmClient();
  const { encrypt: encryptInput, isEncrypting, error: encryptError } = useEncryptedInput();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isReady && client) {
      setIsInitialized(true);
    }
  }, [isReady, client]);

  /**
   * Encrypt a value with type safety
   */
  const encrypt = async (value: number | boolean, type: string) => {
    if (!isInitialized) {
      throw new Error('FHE client not initialized');
    }

    return await encryptInput(value, type as any);
  };

  /**
   * Get the FHEVM instance for direct operations
   */
  const getInstance = () => {
    if (!client) {
      throw new Error('FHE client not available');
    }
    return client.getInstance();
  };

  /**
   * Get a contract instance for FHE operations
   */
  const getContract = (address: string, abi: any[]) => {
    if (!client) {
      throw new Error('FHE client not available');
    }
    return client.getContract(address, abi);
  };

  /**
   * Get a contract instance with signer for write operations
   */
  const getConnectedContract = (address: string, abi: any[]) => {
    if (!client) {
      throw new Error('FHE client not available');
    }
    return client.getConnectedContract(address, abi);
  };

  return {
    // State
    isLoading,
    isReady: isInitialized,
    isEncrypting,
    error: clientError || encryptError,

    // Client
    client,

    // Operations
    encrypt,
    getInstance,
    getContract,
    getConnectedContract,
  };
};
