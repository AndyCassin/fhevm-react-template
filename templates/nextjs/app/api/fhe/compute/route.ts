import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider, Contract } from 'ethers';

/**
 * Homomorphic Computation API Route
 * Demonstrates FHE computation capabilities on encrypted data
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, contractAddress, abi, method, params } = await request.json();

    if (!contractAddress || !abi || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: contractAddress, abi, and method' },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const provider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.zama.ai'
    );

    const fhevm = await createFhevmInstance({ provider });
    const contract = fhevm.getContract(contractAddress, abi);

    let result;

    switch (operation) {
      case 'call':
        // Call read-only method on contract
        result = await contract[method](...(params || []));
        break;

      case 'estimate':
        // Estimate gas for transaction
        result = await contract[method].estimateGas(...(params || []));
        break;

      case 'simulate':
        // Simulate computation
        result = await contract[method].staticCall(...(params || []));
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation. Use: call, estimate, or simulate' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        result: result.toString(),
        operation,
        method,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Computation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Computation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE Homomorphic Computation API',
    description: 'Perform computations on encrypted data without decryption',
    usage: {
      method: 'POST',
      body: {
        operation: 'Type of operation (call, estimate, simulate)',
        contractAddress: 'Smart contract address',
        abi: 'Contract ABI array',
        method: 'Method name to call',
        params: 'Method parameters (optional)',
      },
      example: {
        operation: 'call',
        contractAddress: '0x1234567890123456789012345678901234567890',
        abi: [],
        method: 'add',
        params: ['encryptedA', 'encryptedB'],
      },
    },
    capabilities: [
      'Addition on encrypted integers',
      'Multiplication on encrypted values',
      'Comparison operations',
      'Boolean operations on encrypted data',
      'Gas estimation for FHE operations',
    ],
  });
}
