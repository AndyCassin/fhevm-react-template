// Core exports
export { createFhevmInstance, FhevmClientImpl } from './client';
export { encryptInput, EncryptionHelper } from './encryption';
export { userDecrypt, publicDecrypt } from './decrypt';

// Type exports
export type {
  EthersProvider,
  EncryptionType,
  EncryptedValue,
  FhevmConfig,
  FhevmClient,
  DecryptOptions,
  PublicDecryptOptions,
} from './types';
