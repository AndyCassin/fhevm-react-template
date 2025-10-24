import React, { ReactNode } from 'react';
import { BrowserProvider, JsonRpcProvider, Signer, Contract } from 'ethers';
import { FhevmInstance } from 'fhevmjs';

type EthersProvider = BrowserProvider | JsonRpcProvider;
type EncryptionType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';
interface EncryptedValue {
    data: Uint8Array;
    handles: string[];
}
interface FhevmClient {
    getInstance(): FhevmInstance;
    getSigner(): Promise<Signer>;
    getContract(address: string, abi: any): Contract;
    getConnectedContract(address: string, abi: any): Promise<Contract>;
}

interface FhevmContextValue {
    client: FhevmClient | null;
    isLoading: boolean;
    isReady: boolean;
    error: Error | null;
}
interface FhevmProviderProps {
    provider: EthersProvider;
    chainId?: number;
    gatewayUrl?: string;
    aclAddress?: string;
    children: ReactNode;
}
declare function FhevmProvider({ provider, chainId, gatewayUrl, aclAddress, children, }: FhevmProviderProps): React.JSX.Element;
declare function useFhevmContext(): FhevmContextValue;

interface UseFhevmClientOptions {
    provider?: EthersProvider;
    chainId?: number;
    gatewayUrl?: string;
    aclAddress?: string;
}
interface UseFhevmClientResult {
    client: FhevmClient | null;
    isLoading: boolean;
    isReady: boolean;
    error: Error | null;
}
declare function useFhevmClient(options?: UseFhevmClientOptions): UseFhevmClientResult;

interface UseFhevmContractOptions {
    address: string;
    abi: any;
    withSigner?: boolean;
}
declare function useFhevmContract(options: UseFhevmContractOptions): Contract | null;

interface UseEncryptedInputResult {
    encrypt: (value: number | boolean | string | bigint, type: EncryptionType) => Promise<EncryptedValue>;
    isEncrypting: boolean;
    error: Error | null;
}
declare function useEncryptedInput(): UseEncryptedInputResult;

interface UseDecryptResult {
    decrypt: (contractAddress: string, handle: string) => Promise<bigint>;
    isDecrypting: boolean;
    result: bigint | null;
    error: Error | null;
}
declare function useDecrypt(): UseDecryptResult;

export { FhevmProvider, type FhevmProviderProps, type UseDecryptResult, type UseEncryptedInputResult, type UseFhevmClientOptions, type UseFhevmClientResult, type UseFhevmContractOptions, useDecrypt, useEncryptedInput, useFhevmClient, useFhevmContext, useFhevmContract };
