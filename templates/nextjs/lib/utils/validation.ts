/**
 * Validation utilities for FHE operations
 */

import type { FheType } from '../fhe/types';

/**
 * Validate FHE type
 */
export function isValidFheType(type: string): type is FheType {
  const validTypes: FheType[] = [
    'bool',
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uint128',
    'address',
  ];
  return validTypes.includes(type as FheType);
}

/**
 * Validate value for specific FHE type
 */
export function validateValueForType(value: any, type: FheType): boolean {
  switch (type) {
    case 'bool':
      return typeof value === 'boolean';

    case 'uint8':
      return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 255
      );

    case 'uint16':
      return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 65535
      );

    case 'uint32':
      return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 4294967295
      );

    case 'uint64':
    case 'uint128':
      return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0
      );

    case 'address':
      return (
        typeof value === 'string' &&
        /^0x[0-9a-fA-F]{40}$/.test(value)
      );

    default:
      return false;
  }
}

/**
 * Get value range for FHE type
 */
export function getTypeRange(type: FheType): { min: number; max: number } | null {
  switch (type) {
    case 'bool':
      return { min: 0, max: 1 };
    case 'uint8':
      return { min: 0, max: 255 };
    case 'uint16':
      return { min: 0, max: 65535 };
    case 'uint32':
      return { min: 0, max: 4294967295 };
    case 'uint64':
      return { min: 0, max: Number.MAX_SAFE_INTEGER };
    case 'uint128':
      return { min: 0, max: Number.MAX_SAFE_INTEGER };
    default:
      return null;
  }
}

/**
 * Validate contract ABI
 */
export function validateAbi(abi: any): boolean {
  if (!Array.isArray(abi)) {
    return false;
  }

  if (abi.length === 0) {
    return false;
  }

  // Check if ABI has at least one valid entry
  return abi.some(
    entry =>
      entry &&
      typeof entry === 'object' &&
      ('type' in entry || 'name' in entry)
  );
}

/**
 * Validate encryption result
 */
export function validateEncryptionResult(result: any): boolean {
  if (!result || typeof result !== 'object') {
    return false;
  }

  if (!result.data || !(result.data instanceof Uint8Array)) {
    return false;
  }

  if (!Array.isArray(result.handles)) {
    return false;
  }

  return result.data.length > 0;
}

/**
 * Validate RPC URL format
 */
export function isValidRpcUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate chain ID
 */
export function isValidChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}

/**
 * Validate method name
 */
export function isValidMethodName(name: string): boolean {
  // Method names should be alphanumeric and can contain underscores
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

/**
 * Validate gas limit
 */
export function isValidGasLimit(gas: bigint | number): boolean {
  const gasNum = typeof gas === 'bigint' ? Number(gas) : gas;
  return gasNum > 0 && gasNum <= 30000000; // Typical block gas limit
}

/**
 * Parse and validate user input
 */
export function parseUserInput(
  input: string,
  type: FheType
): number | boolean | string {
  switch (type) {
    case 'bool':
      const lowerInput = input.toLowerCase();
      if (lowerInput === 'true' || lowerInput === '1') return true;
      if (lowerInput === 'false' || lowerInput === '0') return false;
      throw new Error('Invalid boolean value');

    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'uint64':
    case 'uint128':
      const num = Number(input);
      if (isNaN(num)) {
        throw new Error('Invalid number');
      }
      if (!validateValueForType(num, type)) {
        const range = getTypeRange(type);
        throw new Error(
          `Value out of range. Must be between ${range?.min} and ${range?.max}`
        );
      }
      return Math.floor(num);

    case 'address':
      if (!/^0x[0-9a-fA-F]{40}$/.test(input)) {
        throw new Error('Invalid Ethereum address');
      }
      return input;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
