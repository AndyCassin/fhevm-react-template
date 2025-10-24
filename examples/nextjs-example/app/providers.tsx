'use client';

import { FhevmProvider } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';
import { useState, useEffect, ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Provider = new BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">MetaMask Required</h2>
          <p className="text-gray-600">
            Please install MetaMask to use this application.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return <FhevmProvider provider={provider}>{children}</FhevmProvider>;
}
