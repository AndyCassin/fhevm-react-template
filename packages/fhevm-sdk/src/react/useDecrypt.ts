import { useState, useCallback } from 'react';
import { useFhevmContext } from './FhevmProvider';
import { userDecrypt } from '../decrypt';

export interface UseDecryptResult {
  decrypt: (contractAddress: string, handle: string) => Promise<bigint>;
  isDecrypting: boolean;
  result: bigint | null;
  error: Error | null;
}

export function useDecrypt(): UseDecryptResult {
  const { client, isReady } = useFhevmContext();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [result, setResult] = useState<bigint | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (contractAddress: string, handle: string): Promise<bigint> => {
      if (!isReady || !client) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const signer = await client.getSigner();
        const decrypted = await userDecrypt({
          contractAddress,
          handle,
          signer,
        });

        setResult(decrypted);
        setIsDecrypting(false);
        return decrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setIsDecrypting(false);
        throw error;
      }
    },
    [client, isReady]
  );

  return {
    decrypt,
    isDecrypting,
    result,
    error,
  };
}
