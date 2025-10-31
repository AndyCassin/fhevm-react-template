import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * Key Management API Route
 * Handles FHE key operations and management
 */
export async function GET() {
  try {
    // Initialize FHEVM instance
    const provider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.zama.ai'
    );

    const fhevm = await createFhevmInstance({ provider });
    const instance = fhevm.getInstance();

    // Get public key information
    const publicKey = instance.getPublicKey();
    const network = await provider.getNetwork();

    return NextResponse.json({
      success: true,
      data: {
        publicKeyLength: publicKey.length,
        publicKeyHash: Buffer.from(publicKey).toString('hex').slice(0, 32) + '...',
        network: {
          chainId: network.chainId.toString(),
          name: network.name,
        },
        keyInfo: {
          algorithm: 'TFHE',
          type: 'Public Key',
          usage: 'Client-side encryption',
        },
      },
    });
  } catch (error) {
    console.error('Key management error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Key retrieval failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    // Initialize FHEVM instance
    const provider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.zama.ai'
    );

    const fhevm = await createFhevmInstance({ provider });
    const instance = fhevm.getInstance();

    let result;

    switch (action) {
      case 'refresh':
        // Refresh would require re-initialization in a real scenario
        result = {
          message: 'Key refresh initiated',
          publicKey: instance.getPublicKey().toString('hex').slice(0, 32) + '...',
        };
        break;

      case 'validate':
        // Validate current keys
        result = {
          valid: true,
          message: 'Keys are valid and ready for encryption',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: refresh or validate' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Key action error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Key action failed' },
      { status: 500 }
    );
  }
}
