import { useState, useEffect } from 'react';
import { createFhevmInstance } from '../client';
import type { FhevmClient, EthersProvider } from '../types';

export interface UseFhevmClientOptions {
  provider?: EthersProvider;
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface UseFhevmClientResult {
  client: FhevmClient | null;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

export function useFhevmClient(options: UseFhevmClientOptions = {}): UseFhevmClientResult {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { provider, chainId, gatewayUrl, aclAddress } = options;

  useEffect(() => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function initClient() {
      try {
        setIsLoading(true);
        setError(null);

        const fhevmClient = await createFhevmInstance({
          provider: provider!,
          chainId,
          gatewayUrl,
          aclAddress,
        });

        if (mounted) {
          setClient(fhevmClient);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    initClient();

    return () => {
      mounted = false;
    };
  }, [provider, chainId, gatewayUrl, aclAddress]);

  return {
    client,
    isLoading,
    isReady: !!client && !isLoading,
    error,
  };
}
