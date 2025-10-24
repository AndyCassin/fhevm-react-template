import type { FhevmInstance } from 'fhevmjs';
import type { EncryptionType, EncryptedValue } from './types';

export async function encryptInput(
  instance: FhevmInstance,
  value: number | boolean | string,
  type: EncryptionType
): Promise<EncryptedValue> {
  let encryptedData: Uint8Array;
  const handles: string[] = [];

  switch (type) {
    case 'bool':
      encryptedData = await instance.encrypt_bool(Boolean(value));
      break;
    case 'uint8':
      encryptedData = await instance.encrypt_uint8(Number(value));
      break;
    case 'uint16':
      encryptedData = await instance.encrypt_uint16(Number(value));
      break;
    case 'uint32':
      encryptedData = await instance.encrypt_uint32(Number(value));
      break;
    case 'uint64':
      encryptedData = await instance.encrypt_uint64(BigInt(value));
      break;
    case 'uint128':
      encryptedData = await instance.encrypt_uint128(BigInt(value));
      break;
    case 'uint256':
      encryptedData = await instance.encrypt_uint256(BigInt(value));
      break;
    case 'address':
      encryptedData = await instance.encrypt_address(String(value));
      break;
    default:
      throw new Error(`Unsupported encryption type: ${type}`);
  }

  return {
    data: encryptedData,
    handles,
  };
}

export class EncryptionHelper {
  constructor(private instance: FhevmInstance) {}

  async encrypt(value: number | boolean | string, type: EncryptionType): Promise<EncryptedValue> {
    return encryptInput(this.instance, value, type);
  }

  async encryptBool(value: boolean): Promise<EncryptedValue> {
    return this.encrypt(value, 'bool');
  }

  async encryptUint8(value: number): Promise<EncryptedValue> {
    return this.encrypt(value, 'uint8');
  }

  async encryptUint16(value: number): Promise<EncryptedValue> {
    return this.encrypt(value, 'uint16');
  }

  async encryptUint32(value: number): Promise<EncryptedValue> {
    return this.encrypt(value, 'uint32');
  }

  async encryptUint64(value: bigint | number): Promise<EncryptedValue> {
    return this.encrypt(value, 'uint64');
  }

  async encryptUint128(value: bigint | number): Promise<EncryptedValue> {
    return this.encrypt(value, 'uint128');
  }

  async encryptUint256(value: bigint | number | string): Promise<EncryptedValue> {
    return this.encrypt(value, 'uint256');
  }

  async encryptAddress(value: string): Promise<EncryptedValue> {
    return this.encrypt(value, 'address');
  }
}
