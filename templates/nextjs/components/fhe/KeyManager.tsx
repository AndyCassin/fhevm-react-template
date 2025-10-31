'use client';

import { useState, useEffect } from 'react';
import { useFhevmClient } from '@fhevm/sdk/react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface KeyInfo {
  publicKeyLength?: number;
  publicKeyHash?: string;
  network?: {
    chainId: string;
    name: string;
  };
}

export const KeyManager = () => {
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { client, isReady } = useFhevmClient();

  const fetchKeyInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keys');
      const data = await response.json();

      if (data.success) {
        setKeyInfo(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch key info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Keys refreshed successfully');
        await fetchKeyInfo();
      }
    } catch (error) {
      console.error('Failed to refresh keys:', error);
      alert('Failed to refresh keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate' }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.data.message);
      }
    } catch (error) {
      console.error('Failed to validate keys:', error);
      alert('Failed to validate keys');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchKeyInfo();
    }
  }, [isReady]);

  return (
    <Card>
      <CardHeader
        title="FHE Key Management"
        subtitle="Manage encryption keys for FHEVM operations"
      />
      <CardContent>
        <div className="space-y-4">
          {/* SDK Status */}
          <div className={`p-4 rounded-lg ${isReady ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`font-medium ${isReady ? 'text-green-900' : 'text-yellow-900'}`}>
              SDK Status: {isReady ? 'Ready' : 'Initializing...'}
            </p>
          </div>

          {/* Key Information */}
          {keyInfo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Public Key Length:</p>
                <p className="text-lg font-mono text-gray-900">{keyInfo.publicKeyLength} bytes</p>
              </div>

              {keyInfo.publicKeyHash && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Public Key Hash:</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{keyInfo.publicKeyHash}</p>
                </div>
              )}

              {keyInfo.network && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Network:</p>
                  <p className="text-gray-900">
                    {keyInfo.network.name} (Chain ID: {keyInfo.network.chainId})
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleRefreshKeys}
              loading={isLoading}
              disabled={!isReady || isLoading}
              variant="secondary"
            >
              Refresh Keys
            </Button>
            <Button
              onClick={handleValidateKeys}
              loading={isLoading}
              disabled={!isReady || isLoading}
              variant="outline"
            >
              Validate Keys
            </Button>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">About FHE Keys:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Public keys are used for client-side encryption</li>
              <li>• Keys are automatically managed by the FHEVM network</li>
              <li>• No private key management required on the client side</li>
              <li>• All encrypted data is secure end-to-end</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
