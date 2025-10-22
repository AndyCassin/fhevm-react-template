import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createFhevmInstance } from '../client';
import type { FhevmClient, EthersProvider } from '../types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

export interface FhevmProviderProps {
  provider: EthersProvider;
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
  children: ReactNode;
}

export function FhevmProvider({
  provider,
  chainId,
  gatewayUrl,
  aclAddress,
  children,
}: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initFhevm() {
      try {
        setIsLoading(true);
        setError(null);

        const fhevmClient = await createFhevmInstance({
          provider,
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

    initFhevm();

    return () => {
      mounted = false;
    };
  }, [provider, chainId, gatewayUrl, aclAddress]);

  const value: FhevmContextValue = {
    client,
    isLoading,
    isReady: !!client && !isLoading,
    error,
  };

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>;
}

export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevmContext must be used within a FhevmProvider');
  }
  return context;
}
