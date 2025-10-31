/**
 * Type definitions for FHE operations
 */

export type FheType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'address';

export interface EncryptedData {
  data: Uint8Array;
  handles: string[];
}

export interface EncryptionOptions {
  type: FheType;
  value: number | boolean | string;
}

export interface DecryptionOptions {
  contractAddress: string;
  handle: string;
  type?: 'user' | 'public';
}

export interface FheConfig {
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
  rpcUrl?: string;
}

export interface ComputationOperation {
  method: string;
  params: any[];
  contractAddress: string;
  abi: any[];
}
