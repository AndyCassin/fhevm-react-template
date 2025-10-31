'use client';

import { useState } from 'react';
import { useEncryptedInput } from '@fhevm/sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';

export const ComputationDemo = () => {
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);
  const { encrypt } = useEncryptedInput();

  const handleCompute = async () => {
    if (!value1 || !value2) {
      alert('Please enter both values');
      return;
    }

    setIsComputing(true);
    try {
      const num1 = parseInt(value1);
      const num2 = parseInt(value2);

      if (isNaN(num1) || isNaN(num2)) {
        alert('Please enter valid numbers');
        return;
      }

      // Encrypt both values
      const encrypted1 = await encrypt(num1, 'uint32');
      const encrypted2 = await encrypt(num2, 'uint32');

      // Simulate homomorphic computation
      let computedResult: string;
      switch (operation) {
        case 'add':
          computedResult = `Encrypted result of ${num1} + ${num2} (would be computed on-chain)`;
          break;
        case 'subtract':
          computedResult = `Encrypted result of ${num1} - ${num2} (would be computed on-chain)`;
          break;
        case 'multiply':
          computedResult = `Encrypted result of ${num1} × ${num2} (would be computed on-chain)`;
          break;
        case 'compare':
          computedResult = `Encrypted comparison of ${num1} vs ${num2} (would be computed on-chain)`;
          break;
        default:
          computedResult = 'Unknown operation';
      }

      setResult(computedResult);
    } catch (error) {
      console.error('Computation error:', error);
      alert('Computation failed: ' + (error as Error).message);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Homomorphic Computation Demo"
        subtitle="Perform operations on encrypted data without decryption"
      />
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Value"
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter first number"
              disabled={isComputing}
            />
            <Input
              label="Second Value"
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter second number"
              disabled={isComputing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isComputing}
            >
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (-)</option>
              <option value="multiply">Multiplication (×)</option>
              <option value="compare">Comparison (&gt;, &lt;, ==)</option>
            </select>
          </div>

          <Button
            onClick={handleCompute}
            loading={isComputing}
            disabled={!value1 || !value2 || isComputing}
            className="w-full"
          >
            {isComputing ? 'Computing...' : 'Compute on Encrypted Data'}
          </Button>

          {result && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Computation Result:</p>
              <p className="text-blue-700">{result}</p>
              <p className="text-xs text-blue-600 mt-2">
                Note: This is a demonstration. In production, the computation happens on-chain
                with the encrypted values, and the result remains encrypted until explicitly decrypted.
              </p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Supported Operations:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Addition of encrypted integers</li>
              <li>• Subtraction of encrypted values</li>
              <li>• Multiplication with encrypted data</li>
              <li>• Comparison operations (greater than, less than, equal)</li>
              <li>• Boolean operations on encrypted bits</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
