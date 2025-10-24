'use client';

import { useState } from 'react';
import { useEncryptedInput, useFhevmClient } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [value, setValue] = useState<string>('');
  const [encryptedResult, setEncryptedResult] = useState<string>('');

  const { encrypt, isEncrypting } = useEncryptedInput();
  const { client, isReady } = useFhevmClient({
    provider: typeof window !== 'undefined' && window.ethereum
      ? new BrowserProvider(window.ethereum)
      : undefined,
  });

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const handleEncrypt = async () => {
    if (!value) {
      alert('Please enter a value');
      return;
    }

    try {
      const numValue = parseInt(value);
      const encrypted = await encrypt(numValue, 'uint32');
      setEncryptedResult(
        `Encrypted! Data length: ${encrypted.data.length} bytes, Handles: ${encrypted.handles.length}`
      );
    } catch (error) {
      console.error('Encryption error:', error);
      alert('Encryption failed: ' + (error as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FHEVM SDK Example
          </h1>
          <p className="text-xl text-gray-600">
            Next.js 14 + App Router + FHEVM SDK
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              SDK: {isReady ? 'Ready' : 'Initializing'}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              Wallet: {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            1. Connect Wallet
          </h2>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Connect MetaMask
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-medium">
                Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          )}
        </div>

        {/* Encryption Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            2. Encrypt Data
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter a number to encrypt (uint32)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., 42"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isReady || !isConnected}
              />
            </div>
            <button
              onClick={handleEncrypt}
              disabled={!isReady || !isConnected || isEncrypting || !value}
              className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt with FHE'}
            </button>
            {encryptedResult && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-indigo-800 font-medium">{encryptedResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              FHE Encryption
            </h3>
            <p className="text-gray-600 text-sm">
              Fully Homomorphic Encryption for confidential computation
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              React Hooks
            </h3>
            <p className="text-gray-600 text-sm">
              Simple, composable hooks for encryption and decryption
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Framework Agnostic
            </h3>
            <p className="text-gray-600 text-sm">
              Works with Next.js, React, Vue, or vanilla JavaScript
            </p>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Start Code</h2>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
            <code>{`import { useEncryptedInput } from '@fhevm/sdk/react';

function MyComponent() {
  const { encrypt } = useEncryptedInput();

  const handleEncrypt = async (value: number) => {
    const encrypted = await encrypt(value, 'uint32');
    // Use encrypted.data with your smart contract
  };

  return <button onClick={() => handleEncrypt(42)}>
    Encrypt
  </button>;
}`}</code>
          </pre>
        </div>
      </div>
    </main>
  );
}
