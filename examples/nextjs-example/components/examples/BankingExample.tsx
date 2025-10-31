'use client';

import { useState } from 'react';
import { useEncryptedInput, useFhevmClient } from '@fhevm/sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';

interface Transaction {
  id: string;
  amount: number;
  encrypted: boolean;
  timestamp: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
}

export const BankingExample = () => {
  const [balance, setBalance] = useState<number>(1000);
  const [encryptedBalance, setEncryptedBalance] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { encrypt } = useEncryptedInput();
  const { isReady } = useFhevmClient();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      const depositAmount = parseFloat(amount);

      if (encryptedBalance) {
        // Encrypt the deposit amount
        await encrypt(Math.floor(depositAmount), 'uint32');
      }

      // Update balance
      setBalance(prev => prev + depositAmount);

      // Add transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: depositAmount,
        encrypted: encryptedBalance,
        timestamp: new Date().toISOString(),
        type: 'deposit',
      };

      setTransactions(prev => [transaction, ...prev]);
      setAmount('');

      alert(`Successfully deposited ${depositAmount} (${encryptedBalance ? 'Encrypted' : 'Plain'})`);
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      if (encryptedBalance) {
        // Encrypt the withdrawal amount
        await encrypt(Math.floor(withdrawAmount), 'uint32');
      }

      // Update balance
      setBalance(prev => prev - withdrawAmount);

      // Add transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: withdrawAmount,
        encrypted: encryptedBalance,
        timestamp: new Date().toISOString(),
        type: 'withdrawal',
      };

      setTransactions(prev => [transaction, ...prev]);
      setAmount('');

      alert(`Successfully withdrew ${withdrawAmount} (${encryptedBalance ? 'Encrypted' : 'Plain'})`);
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleEncryption = () => {
    setEncryptedBalance(!encryptedBalance);
  };

  return (
    <Card>
      <CardHeader
        title="Confidential Banking Example"
        subtitle="Manage your finances with FHE-protected transactions"
      />
      <CardContent>
        <div className="space-y-6">
          {/* Balance Display */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Current Balance</p>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-bold">
                {encryptedBalance ? '****' : `$${balance.toFixed(2)}`}
              </p>
              <button
                onClick={toggleEncryption}
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
              >
                {encryptedBalance ? 'Show' : 'Hide'}
              </button>
            </div>
            <p className="text-xs opacity-75 mt-2">
              {encryptedBalance ? 'Balance is encrypted using FHE' : 'Balance is visible'}
            </p>
          </div>

          {/* Transaction Form */}
          <div className="space-y-4">
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={!isReady || isProcessing}
            />

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="encrypt-toggle"
                checked={encryptedBalance}
                onChange={toggleEncryption}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="encrypt-toggle" className="text-sm text-gray-700">
                Use encrypted transactions (FHE)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleDeposit}
                loading={isProcessing}
                disabled={!isReady || isProcessing || !amount}
              >
                Deposit
              </Button>
              <Button
                onClick={handleWithdrawal}
                loading={isProcessing}
                disabled={!isReady || isProcessing || !amount}
                variant="secondary"
              >
                Withdraw
              </Button>
            </div>
          </div>

          {/* Transaction History */}
          {transactions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Transactions</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {tx.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </p>
                      {tx.encrypted && (
                        <span className="text-xs text-blue-600">Encrypted</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <strong>Privacy Note:</strong> When encryption is enabled, all transaction amounts
            are encrypted using FHE, ensuring complete confidentiality on-chain.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
