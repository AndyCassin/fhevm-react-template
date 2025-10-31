'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { createFhevmInstance } from '@fhevm/sdk';
import type { FhevmClient } from '@fhevm/sdk';

interface FHEContextValue {
  client: FhevmClient | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  provider: BrowserProvider | null;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

interface FHEProviderProps {
  children: ReactNode;
  provider?: BrowserProvider;
}

export const FHEProvider: React.FC<FHEProviderProps> = ({ children, provider: externalProvider }) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    const initializeFHE = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use external provider or create from window.ethereum
        let activeProvider = externalProvider;

        if (!activeProvider && typeof window !== 'undefined' && window.ethereum) {
          activeProvider = new BrowserProvider(window.ethereum);
        }

        if (!activeProvider) {
          throw new Error('No Ethereum provider found. Please install MetaMask.');
        }

        setProvider(activeProvider);

        // Create FHEVM instance
        const fhevmClient = await createFhevmInstance({
          provider: activeProvider
        });

        setClient(fhevmClient);
        setIsReady(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE';
        setError(errorMessage);
        console.error('FHE initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFHE();
  }, [externalProvider]);

  const value: FHEContextValue = {
    client,
    isLoading,
    isReady,
    error,
    provider,
  };

  return (
    <FHEContext.Provider value={value}>
      {children}
    </FHEContext.Provider>
  );
};

export const useFHEContext = (): FHEContextValue => {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within a FHEProvider');
  }
  return context;
};

export default FHEProvider;
