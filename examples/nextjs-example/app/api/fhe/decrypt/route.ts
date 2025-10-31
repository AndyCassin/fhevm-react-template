import { NextRequest, NextResponse } from 'next/server';
import { usePublicDecrypt } from '@fhevm/sdk';

/**
 * Decryption API Route
 * Handles server-side decryption of FHE data
 * Note: This is for public decryption only. User decryption requires client-side signing.
 */
export async function POST(request: NextRequest) {
  try {
    const { contractAddress, handle, decryptionType = 'public' } = await request.json();

    if (!contractAddress || !handle) {
      return NextResponse.json(
        { error: 'Missing required fields: contractAddress and handle' },
        { status: 400 }
      );
    }

    if (decryptionType === 'user') {
      return NextResponse.json(
        {
          error: 'User decryption must be performed client-side with wallet signature',
          hint: 'Use the useDecrypt hook on the client side for user decryption',
        },
        { status: 400 }
      );
    }

    // Perform public decryption
    const decryptedValue = await usePublicDecrypt(contractAddress, handle);

    return NextResponse.json({
      success: true,
      data: {
        decryptedValue,
        handle,
        contractAddress,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Decryption failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE Decryption API',
    note: 'This endpoint only supports public decryption. User decryption requires client-side wallet signature.',
    usage: {
      method: 'POST',
      body: {
        contractAddress: 'Smart contract address containing the encrypted data',
        handle: 'Handle to the encrypted data',
        decryptionType: 'Type of decryption (public only for server-side)',
      },
      example: {
        contractAddress: '0x1234567890123456789012345678901234567890',
        handle: '0xabcdef...',
        decryptionType: 'public',
      },
    },
  });
}
