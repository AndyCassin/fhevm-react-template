import type { BrowserProvider, JsonRpcProvider, Signer, Contract } from 'ethers';
import type { FhevmInstance } from 'fhevmjs';

export type EthersProvider = BrowserProvider | JsonRpcProvider;

export type EncryptionType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address';

export interface EncryptedValue {
  data: Uint8Array;
  handles: string[];
}

export interface FhevmConfig {
  provider: EthersProvider;
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface FhevmClient {
  getInstance(): FhevmInstance;
  getSigner(): Promise<Signer>;
  getContract(address: string, abi: any): Contract;
  getConnectedContract(address: string, abi: any): Promise<Contract>;
}

export interface DecryptOptions {
  contractAddress: string;
  handle: string;
  signer: Signer;
}

export interface PublicDecryptOptions {
  contractAddress: string;
  handle: string;
}
