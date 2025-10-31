import { useState, useCallback } from 'react';
import { useFhevmContract } from '@fhevm/sdk/react';

interface ComputationOptions {
  contractAddress: string;
  abi: any[];
  withSigner?: boolean;
}

interface ComputationResult {
  result: any;
  gasUsed?: bigint;
  timestamp: Date;
}

/**
 * Hook for performing homomorphic computations on encrypted data
 */
export const useComputation = (options: ComputationOptions) => {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ComputationResult | null>(null);

  const contract = useFhevmContract({
    address: options.contractAddress,
    abi: options.abi,
    withSigner: options.withSigner || false,
  });

  /**
   * Call a contract method with encrypted parameters
   */
  const compute = useCallback(
    async (method: string, ...params: any[]) => {
      setIsComputing(true);
      setError(null);

      try {
        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const result = await contract[method](...params);

        const computationResult: ComputationResult = {
          result,
          timestamp: new Date(),
        };

        setLastResult(computationResult);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsComputing(false);
      }
    },
    [contract]
  );

  /**
   * Estimate gas for a computation
   */
  const estimateGas = useCallback(
    async (method: string, ...params: any[]) => {
      try {
        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const gasEstimate = await contract[method].estimateGas(...params);
        return gasEstimate;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Gas estimation failed';
        setError(errorMessage);
        throw err;
      }
    },
    [contract]
  );

  /**
   * Simulate a computation without sending a transaction
   */
  const simulate = useCallback(
    async (method: string, ...params: any[]) => {
      try {
        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const result = await contract[method].staticCall(...params);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Simulation failed';
        setError(errorMessage);
        throw err;
      }
    },
    [contract]
  );

  /**
   * Perform encrypted addition
   */
  const add = useCallback(
    async (encryptedA: any, encryptedB: any) => {
      return await compute('add', encryptedA, encryptedB);
    },
    [compute]
  );

  /**
   * Perform encrypted subtraction
   */
  const subtract = useCallback(
    async (encryptedA: any, encryptedB: any) => {
      return await compute('sub', encryptedA, encryptedB);
    },
    [compute]
  );

  /**
   * Perform encrypted multiplication
   */
  const multiply = useCallback(
    async (encryptedA: any, encryptedB: any) => {
      return await compute('mul', encryptedA, encryptedB);
    },
    [compute]
  );

  /**
   * Perform encrypted comparison
   */
  const compare = useCallback(
    async (encryptedA: any, encryptedB: any, operation: 'gt' | 'lt' | 'eq') => {
      return await compute(operation, encryptedA, encryptedB);
    },
    [compute]
  );

  return {
    // State
    isComputing,
    error,
    lastResult,
    contract,

    // Operations
    compute,
    estimateGas,
    simulate,

    // FHE Operations
    add,
    subtract,
    multiply,
    compare,
  };
};
