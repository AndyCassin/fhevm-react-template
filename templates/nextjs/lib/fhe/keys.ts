/**
 * FHE Key Management Utilities
 * Handles public key retrieval and management
 */

/**
 * Fetch public key from API
 */
export async function fetchPublicKey(): Promise<string> {
  try {
    const response = await fetch('/api/keys');
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to fetch public key');
    }

    return data.data.publicKeyHash;
  } catch (error) {
    console.error('Error fetching public key:', error);
    throw error;
  }
}

/**
 * Validate public key format
 */
export function validatePublicKey(key: string): boolean {
  // Basic validation - check if it's a hex string
  return /^[0-9a-fA-F]+$/.test(key);
}

/**
 * Refresh encryption keys
 */
export async function refreshKeys(): Promise<boolean> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'refresh' }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error refreshing keys:', error);
    return false;
  }
}

/**
 * Validate current keys
 */
export async function validateKeys(): Promise<boolean> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'validate' }),
    });

    const data = await response.json();
    return data.success && data.data.valid;
  } catch (error) {
    console.error('Error validating keys:', error);
    return false;
  }
}

/**
 * Get key information
 */
export async function getKeyInfo() {
  try {
    const response = await fetch('/api/keys');
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to get key info');
    }

    return data.data;
  } catch (error) {
    console.error('Error getting key info:', error);
    throw error;
  }
}

/**
 * Cache management for public keys
 */
const keyCache = new Map<string, { key: string; timestamp: number }>();
const KEY_CACHE_TTL = 3600000; // 1 hour

export function getCachedKey(identifier: string): string | null {
  const cached = keyCache.get(identifier);

  if (!cached) {
    return null;
  }

  // Check if cache is still valid
  if (Date.now() - cached.timestamp > KEY_CACHE_TTL) {
    keyCache.delete(identifier);
    return null;
  }

  return cached.key;
}

export function setCachedKey(identifier: string, key: string): void {
  keyCache.set(identifier, {
    key,
    timestamp: Date.now(),
  });
}

export function clearKeyCache(): void {
  keyCache.clear();
}
