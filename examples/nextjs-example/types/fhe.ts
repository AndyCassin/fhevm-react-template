/**
 * FHE-specific TypeScript type definitions
 */

export type FheType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'address';

export interface EncryptedValue {
  data: Uint8Array;
  handles: string[];
}

export interface EncryptionRequest {
  value: number | boolean | string;
  type: FheType;
}

export interface EncryptionResponse {
  success: boolean;
  data?: {
    encryptedData: number[];
    handles: string[];
    type: FheType;
    timestamp: string;
  };
  error?: string;
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
  decryptionType: 'user' | 'public';
}

export interface DecryptionResponse {
  success: boolean;
  data?: {
    decryptedValue: bigint | string;
    handle: string;
    contractAddress: string;
    timestamp: string;
  };
  error?: string;
}

export interface FheClientConfig {
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
  rpcUrl?: string;
}

export interface FheOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface ComputationRequest {
  operation: 'call' | 'estimate' | 'simulate';
  contractAddress: string;
  abi: any[];
  method: string;
  params?: any[];
}

export interface KeyInfo {
  publicKeyLength: number;
  publicKeyHash: string;
  network: {
    chainId: string;
    name: string;
  };
  keyInfo: {
    algorithm: string;
    type: string;
    usage: string;
  };
}

export interface FheTransaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  data: string;
  gasLimit: bigint;
  gasPrice: bigint;
  encrypted: boolean;
}

export interface FheError {
  code: string;
  message: string;
  details?: any;
}
