import * as ethers from 'ethers';
import { BrowserProvider, JsonRpcProvider, Signer, Contract } from 'ethers';
import { FhevmInstance } from 'fhevmjs';

type EthersProvider = BrowserProvider | JsonRpcProvider;
type EncryptionType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';
interface EncryptedValue {
    data: Uint8Array;
    handles: string[];
}
interface FhevmConfig {
    provider: EthersProvider;
    chainId?: number;
    gatewayUrl?: string;
    aclAddress?: string;
}
interface FhevmClient {
    getInstance(): FhevmInstance;
    getSigner(): Promise<Signer>;
    getContract(address: string, abi: any): Contract;
    getConnectedContract(address: string, abi: any): Promise<Contract>;
}
interface DecryptOptions {
    contractAddress: string;
    handle: string;
    signer: Signer;
}
interface PublicDecryptOptions {
    contractAddress: string;
    handle: string;
}

declare class FhevmClientImpl implements FhevmClient {
    private instance;
    private provider;
    private config;
    constructor(config: FhevmConfig);
    initialize(): Promise<void>;
    getInstance(): FhevmInstance;
    getSigner(): Promise<ethers.JsonRpcSigner>;
    getContract(address: string, abi: any): Contract;
    getConnectedContract(address: string, abi: any): Promise<Contract>;
}
declare function createFhevmInstance(config: FhevmConfig): Promise<FhevmClient>;

declare function encryptInput(instance: FhevmInstance, value: number | boolean | string | bigint, type: EncryptionType): Promise<EncryptedValue>;
declare class EncryptionHelper {
    private instance;
    constructor(instance: FhevmInstance);
    encrypt(value: number | boolean | string | bigint, type: EncryptionType): Promise<EncryptedValue>;
    encryptBool(value: boolean): Promise<EncryptedValue>;
    encryptUint8(value: number): Promise<EncryptedValue>;
    encryptUint16(value: number): Promise<EncryptedValue>;
    encryptUint32(value: number): Promise<EncryptedValue>;
    encryptUint64(value: bigint | number): Promise<EncryptedValue>;
    encryptUint128(value: bigint | number): Promise<EncryptedValue>;
    encryptUint256(value: bigint | number | string): Promise<EncryptedValue>;
    encryptAddress(value: string): Promise<EncryptedValue>;
}

/**
 * Decrypt encrypted data using user's EIP-712 signature
 * This allows the user to decrypt their own encrypted data
 */
declare function userDecrypt(options: DecryptOptions): Promise<bigint>;
/**
 * Decrypt publicly available encrypted data
 * This is for data that has been explicitly made public
 */
declare function publicDecrypt(options: PublicDecryptOptions): Promise<bigint>;

export { type DecryptOptions, type EncryptedValue, EncryptionHelper, type EncryptionType, type EthersProvider, type FhevmClient, FhevmClientImpl, type FhevmConfig, type PublicDecryptOptions, createFhevmInstance, encryptInput, publicDecrypt, userDecrypt };
