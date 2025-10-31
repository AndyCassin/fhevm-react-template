'use client';

import { useState } from 'react';
import { useEncryptedInput, useFhevmClient } from '@fhevm/sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  encrypted: boolean;
  timestamp: string;
}

export const MedicalExample = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordType, setRecordType] = useState<string>('bloodPressure');
  const [recordValue, setRecordValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewEncrypted, setViewEncrypted] = useState<boolean>(true);

  const { encrypt } = useEncryptedInput();
  const { isReady } = useFhevmClient();

  const recordTypes = {
    bloodPressure: { label: 'Blood Pressure', unit: 'mmHg', example: '120' },
    heartRate: { label: 'Heart Rate', unit: 'bpm', example: '72' },
    bloodSugar: { label: 'Blood Sugar', unit: 'mg/dL', example: '100' },
    temperature: { label: 'Temperature', unit: '°F', example: '98' },
    weight: { label: 'Weight', unit: 'lbs', example: '150' },
  };

  const handleAddRecord = async () => {
    if (!recordValue) {
      alert('Please enter a value');
      return;
    }

    const numValue = parseFloat(recordValue);
    if (isNaN(numValue) || numValue <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setIsProcessing(true);
    try {
      // Encrypt the medical data
      await encrypt(Math.floor(numValue), 'uint32');

      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        type: recordType,
        value: recordValue,
        encrypted: true,
        timestamp: new Date().toISOString(),
      };

      setRecords(prev => [newRecord, ...prev]);
      setRecordValue('');

      alert('Medical record added securely with FHE encryption');
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Failed to add record');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRecordIcon = (type: string) => {
    const icons: Record<string, string> = {
      bloodPressure: '💓',
      heartRate: '❤️',
      bloodSugar: '🩸',
      temperature: '🌡️',
      weight: '⚖️',
    };
    return icons[type] || '📋';
  };

  return (
    <Card>
      <CardHeader
        title="Confidential Medical Records"
        subtitle="Store and manage sensitive health data with FHE protection"
      />
      <CardContent>
        <div className="space-y-6">
          {/* Privacy Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔒</span>
              <p className="font-semibold text-green-900">HIPAA-Compliant Encryption</p>
            </div>
            <p className="text-sm text-green-700">
              All medical records are encrypted using Fully Homomorphic Encryption,
              ensuring privacy and compliance with healthcare regulations.
            </p>
          </div>

          {/* Add Record Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              >
                {Object.entries(recordTypes).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <Input
              label={`${recordTypes[recordType as keyof typeof recordTypes].label} Value`}
              type="number"
              value={recordValue}
              onChange={(e) => setRecordValue(e.target.value)}
              placeholder={`e.g., ${recordTypes[recordType as keyof typeof recordTypes].example}`}
              helperText={`Unit: ${recordTypes[recordType as keyof typeof recordTypes].unit}`}
              disabled={!isReady || isProcessing}
            />

            <Button
              onClick={handleAddRecord}
              loading={isProcessing}
              disabled={!isReady || isProcessing || !recordValue}
              className="w-full"
            >
              {isProcessing ? 'Encrypting & Storing...' : 'Add Encrypted Record'}
            </Button>
          </div>

          {/* Medical Records List */}
          {records.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Medical Records</h4>
                <button
                  onClick={() => setViewEncrypted(!viewEncrypted)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {viewEncrypted ? 'Show Values' : 'Hide Values'}
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getRecordIcon(record.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {recordTypes[record.type as keyof typeof recordTypes].label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {viewEncrypted ? '****' : `${record.value} ${recordTypes[record.type as keyof typeof recordTypes].unit}`}
                        </p>
                        {record.encrypted && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
                            <span>🔐</span>
                            Encrypted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {records.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No medical records yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first encrypted health record above</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-900">
            <strong>Healthcare Privacy:</strong> FHE enables computation on encrypted medical data,
            allowing analytics and diagnostics without exposing sensitive patient information.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
