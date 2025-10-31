import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * FHE Operations API Route
 * Handles general FHE operations on the server side
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, data } = await request.json();

    // Initialize FHEVM instance with RPC provider
    const provider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.zama.ai'
    );

    const fhevm = await createFhevmInstance({ provider });
    const instance = fhevm.getInstance();

    let result;

    switch (operation) {
      case 'getPublicKey':
        result = {
          publicKey: instance.getPublicKey().toString('hex'),
        };
        break;

      case 'validateInstance':
        result = {
          valid: true,
          chainId: await provider.getNetwork().then(n => n.chainId),
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('FHE operation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE API endpoint',
    endpoints: {
      POST: 'General FHE operations',
      '/api/fhe/encrypt': 'Encryption operations',
      '/api/fhe/decrypt': 'Decryption operations',
      '/api/fhe/compute': 'Homomorphic computation operations',
    },
  });
}
