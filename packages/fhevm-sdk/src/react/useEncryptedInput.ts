import { useState, useCallback } from 'react';
import { useFhevmContext } from './FhevmProvider';
import { encryptInput } from '../encryption';
import type { EncryptionType, EncryptedValue } from '../types';

export interface UseEncryptedInputResult {
  encrypt: (value: number | boolean | string | bigint, type: EncryptionType) => Promise<EncryptedValue>;
  isEncrypting: boolean;
  error: Error | null;
}

export function useEncryptedInput(): UseEncryptedInputResult {
  const { client, isReady } = useFhevmContext();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | boolean | string | bigint, type: EncryptionType): Promise<EncryptedValue> => {
      if (!isReady || !client) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(null);

        const instance = client.getInstance();
        const encrypted = await encryptInput(instance, value, type);

        setIsEncrypting(false);
        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setIsEncrypting(false);
        throw error;
      }
    },
    [client, isReady]
  );

  return {
    encrypt,
    isEncrypting,
    error,
  };
}
