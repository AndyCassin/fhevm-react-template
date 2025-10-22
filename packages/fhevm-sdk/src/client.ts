import { Contract } from 'ethers';
import { createInstance } from 'fhevmjs';
import type { FhevmInstance } from 'fhevmjs';
import type { FhevmConfig, FhevmClient, EthersProvider } from './types';

export class FhevmClientImpl implements FhevmClient {
  private instance: FhevmInstance | null = null;
  private provider: EthersProvider;
  private config: FhevmConfig;

  constructor(config: FhevmConfig) {
    this.provider = config.provider;
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.instance) return;

    const chainId = this.config.chainId ?? (await this.provider.getNetwork()).chainId;

    this.instance = await createInstance({
      chainId: Number(chainId),
      networkUrl: this.config.gatewayUrl,
      aclAddress: this.config.aclAddress,
    });
  }

  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM instance not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  async getSigner() {
    const signer = await this.provider.getSigner();
    return signer;
  }

  getContract(address: string, abi: any): Contract {
    return new Contract(address, abi, this.provider);
  }

  async getConnectedContract(address: string, abi: any): Promise<Contract> {
    const signer = await this.getSigner();
    return new Contract(address, abi, signer);
  }
}

export async function createFhevmInstance(config: FhevmConfig): Promise<FhevmClient> {
  const client = new FhevmClientImpl(config);
  await client.initialize();
  return client;
}
