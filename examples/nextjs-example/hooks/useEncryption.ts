import { useState, useCallback } from 'react';
import { useEncryptedInput } from '@fhevm/sdk/react';

interface EncryptionResult {
  data: Uint8Array;
  handles: string[];
}

/**
 * Enhanced encryption hook with additional utilities
 */
export const useEncryption = () => {
  const { encrypt: baseEncrypt, isEncrypting, error } = useEncryptedInput();
  const [lastResult, setLastResult] = useState<EncryptionResult | null>(null);
  const [history, setHistory] = useState<Array<{ value: any; type: string; timestamp: Date }>>([]);

  /**
   * Encrypt with history tracking
   */
  const encrypt = useCallback(
    async (value: number | boolean, type: string) => {
      const result = await baseEncrypt(value, type as any);
      setLastResult(result);
      setHistory(prev => [...prev, { value, type, timestamp: new Date() }]);
      return result;
    },
    [baseEncrypt]
  );

  /**
   * Encrypt boolean value
   */
  const encryptBool = useCallback(
    async (value: boolean) => {
      return await encrypt(value, 'bool');
    },
    [encrypt]
  );

  /**
   * Encrypt uint8 value
   */
  const encryptUint8 = useCallback(
    async (value: number) => {
      if (value < 0 || value > 255) {
        throw new Error('Value must be between 0 and 255 for uint8');
      }
      return await encrypt(value, 'uint8');
    },
    [encrypt]
  );

  /**
   * Encrypt uint16 value
   */
  const encryptUint16 = useCallback(
    async (value: number) => {
      if (value < 0 || value > 65535) {
        throw new Error('Value must be between 0 and 65535 for uint16');
      }
      return await encrypt(value, 'uint16');
    },
    [encrypt]
  );

  /**
   * Encrypt uint32 value
   */
  const encryptUint32 = useCallback(
    async (value: number) => {
      if (value < 0 || value > 4294967295) {
        throw new Error('Value must be between 0 and 4294967295 for uint32');
      }
      return await encrypt(value, 'uint32');
    },
    [encrypt]
  );

  /**
   * Encrypt uint64 value
   */
  const encryptUint64 = useCallback(
    async (value: number) => {
      if (value < 0) {
        throw new Error('Value must be positive for uint64');
      }
      return await encrypt(value, 'uint64');
    },
    [encrypt]
  );

  /**
   * Clear encryption history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setLastResult(null);
  }, []);

  return {
    // Base operations
    encrypt,
    isEncrypting,
    error,

    // Type-specific encryption
    encryptBool,
    encryptUint8,
    encryptUint16,
    encryptUint32,
    encryptUint64,

    // History and results
    lastResult,
    history,
    clearHistory,
  };
};
