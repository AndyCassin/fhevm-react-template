import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, encryptInput } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * Encryption API Route
 * Handles server-side encryption of data using FHE
 */
export async function POST(request: NextRequest) {
  try {
    const { value, type } = await request.json();

    if (!value || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: value and type' },
        { status: 400 }
      );
    }

    // Validate encryption type
    const validTypes = ['bool', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'address'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const provider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.zama.ai'
    );

    const fhevm = await createFhevmInstance({ provider });
    const instance = fhevm.getInstance();

    // Encrypt the input
    const encrypted = await encryptInput(instance, value, type);

    return NextResponse.json({
      success: true,
      data: {
        encryptedData: Array.from(encrypted.data),
        handles: encrypted.handles,
        type,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Encryption failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE Encryption API',
    usage: {
      method: 'POST',
      body: {
        value: 'Value to encrypt (number, boolean, or address)',
        type: 'Type of value (bool, uint8, uint16, uint32, uint64, uint128, address)',
      },
      example: {
        value: 42,
        type: 'uint32',
      },
    },
  });
}
