'use client';

import { useState } from 'react';
import { useEncryptedInput } from '@fhevm/sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface EncryptionResult {
  data: number[];
  handles: string[];
  timestamp: string;
}

export const EncryptionDemo = () => {
  const [value, setValue] = useState<string>('');
  const [encryptionType, setEncryptionType] = useState<string>('uint32');
  const [result, setResult] = useState<EncryptionResult | null>(null);
  const { encrypt, isEncrypting, error } = useEncryptedInput();

  const handleEncrypt = async () => {
    if (!value) {
      alert('Please enter a value to encrypt');
      return;
    }

    try {
      let processedValue: number | boolean;

      if (encryptionType === 'bool') {
        processedValue = value.toLowerCase() === 'true' || value === '1';
      } else {
        processedValue = parseInt(value);
        if (isNaN(processedValue)) {
          alert('Please enter a valid number');
          return;
        }
      }

      const encrypted = await encrypt(processedValue, encryptionType as any);

      setResult({
        data: Array.from(encrypted.data),
        handles: encrypted.handles,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  return (
    <Card>
      <CardHeader
        title="FHE Encryption Demo"
        subtitle="Encrypt data using Fully Homomorphic Encryption"
      />
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Value to Encrypt"
              type={encryptionType === 'bool' ? 'text' : 'number'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={encryptionType === 'bool' ? 'true or false' : 'Enter a number'}
              disabled={isEncrypting}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encryption Type
              </label>
              <select
                value={encryptionType}
                onChange={(e) => setEncryptionType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isEncrypting}
              >
                <option value="bool">Boolean</option>
                <option value="uint8">uint8 (0-255)</option>
                <option value="uint16">uint16 (0-65535)</option>
                <option value="uint32">uint32</option>
                <option value="uint64">uint64</option>
                <option value="uint128">uint128</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleEncrypt}
            loading={isEncrypting}
            disabled={!value || isEncrypting}
            className="w-full"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt Data'}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-green-900">Encrypted Data:</p>
                <p className="text-xs text-green-700 font-mono mt-1 break-all">
                  {result.data.length} bytes
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Handles:</p>
                <p className="text-xs text-green-700 font-mono mt-1">
                  {result.handles.length > 0 ? result.handles.join(', ') : 'No handles'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Timestamp:</p>
                <p className="text-xs text-green-700 mt-1">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
