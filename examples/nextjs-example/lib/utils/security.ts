/**
 * Security utilities for FHE operations
 * Provides validation and security checks for encrypted data
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Validate encrypted data format
 */
export function validateEncryptedData(data: Uint8Array | number[]): boolean {
  if (!data || data.length === 0) {
    return false;
  }

  // FHE encrypted data should have minimum size
  if (data.length < 32) {
    return false;
  }

  // Check if data contains valid bytes
  const arr = Array.isArray(data) ? data : Array.from(data);
  return arr.every(byte => byte >= 0 && byte <= 255);
}

/**
 * Validate handle format
 */
export function isValidHandle(handle: string): boolean {
  // Handles are typically hex strings
  return /^0x[0-9a-fA-F]+$/.test(handle);
}

/**
 * Sanitize user input before encryption
 */
export function sanitizeInput(value: any, type: string): number | boolean {
  switch (type) {
    case 'bool':
      return Boolean(value);

    case 'uint8':
      const uint8Val = Number(value);
      if (isNaN(uint8Val) || uint8Val < 0 || uint8Val > 255) {
        throw new Error('Invalid uint8 value. Must be between 0 and 255');
      }
      return Math.floor(uint8Val);

    case 'uint16':
      const uint16Val = Number(value);
      if (isNaN(uint16Val) || uint16Val < 0 || uint16Val > 65535) {
        throw new Error('Invalid uint16 value. Must be between 0 and 65535');
      }
      return Math.floor(uint16Val);

    case 'uint32':
      const uint32Val = Number(value);
      if (isNaN(uint32Val) || uint32Val < 0 || uint32Val > 4294967295) {
        throw new Error('Invalid uint32 value. Must be between 0 and 4294967295');
      }
      return Math.floor(uint32Val);

    case 'uint64':
    case 'uint128':
      const uintVal = Number(value);
      if (isNaN(uintVal) || uintVal < 0) {
        throw new Error(`Invalid ${type} value. Must be a positive number`);
      }
      return Math.floor(uintVal);

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Rate limiting for encryption operations
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

export const encryptionRateLimiter = new RateLimiter(50, 60000); // 50 requests per minute

/**
 * Verify data integrity using checksum
 */
export function calculateChecksum(data: Uint8Array): string {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum = (sum + data[i]) % 256;
  }
  return sum.toString(16).padStart(2, '0');
}

/**
 * Secure comparison of encrypted handles
 */
export function secureCompareHandles(handle1: string, handle2: string): boolean {
  if (handle1.length !== handle2.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < handle1.length; i++) {
    result |= handle1.charCodeAt(i) ^ handle2.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Detect potential security issues in contract address
 */
export function validateContractSecurity(address: string): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!isValidAddress(address)) {
    return { valid: false, warnings: ['Invalid address format'] };
  }

  // Check for null address
  if (address === '0x0000000000000000000000000000000000000000') {
    warnings.push('Warning: Null address detected');
  }

  // Check for common test addresses
  if (address.toLowerCase().startsWith('0x00000000')) {
    warnings.push('Warning: Suspicious address pattern');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
