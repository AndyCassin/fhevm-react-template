import { useMemo, useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useFhevmContext } from './FhevmProvider';

export interface UseFhevmContractOptions {
  address: string;
  abi: any;
  withSigner?: boolean;
}

export function useFhevmContract(options: UseFhevmContractOptions): Contract | null {
  const { address, abi, withSigner = false } = options;
  const { client, isReady } = useFhevmContext();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!isReady || !client) {
      setContract(null);
      return;
    }

    async function createContract() {
      if (!client) return;

      try {
        if (withSigner) {
          const connectedContract = await client.getConnectedContract(address, abi);
          setContract(connectedContract);
        } else {
          const readOnlyContract = client.getContract(address, abi);
          setContract(readOnlyContract);
        }
      } catch (error) {
        console.error('Error creating contract:', error);
        setContract(null);
      }
    }

    createContract();
  }, [address, abi, withSigner, client, isReady]);

  return contract;
}
