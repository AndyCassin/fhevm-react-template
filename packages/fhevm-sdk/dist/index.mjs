// src/client.ts
import { Contract } from "ethers";
import { createInstance } from "fhevmjs";
var FhevmClientImpl = class {
  constructor(config) {
    this.instance = null;
    this.provider = config.provider;
    this.config = config;
  }
  async initialize() {
    if (this.instance) return;
    const chainId = this.config.chainId ?? (await this.provider.getNetwork()).chainId;
    this.instance = await createInstance({
      chainId: Number(chainId),
      networkUrl: this.config.gatewayUrl,
      aclAddress: this.config.aclAddress
    });
  }
  getInstance() {
    if (!this.instance) {
      throw new Error("FHEVM instance not initialized. Call initialize() first.");
    }
    return this.instance;
  }
  async getSigner() {
    const signer = await this.provider.getSigner();
    return signer;
  }
  getContract(address, abi) {
    return new Contract(address, abi, this.provider);
  }
  async getConnectedContract(address, abi) {
    const signer = await this.getSigner();
    return new Contract(address, abi, signer);
  }
};
async function createFhevmInstance(config) {
  const client = new FhevmClientImpl(config);
  await client.initialize();
  return client;
}

// src/encryption.ts
async function encryptInput(instance, value, type) {
  let encryptedData;
  const handles = [];
  switch (type) {
    case "bool":
      encryptedData = await instance.encrypt_bool(Boolean(value));
      break;
    case "uint8":
      encryptedData = await instance.encrypt_uint8(Number(value));
      break;
    case "uint16":
      encryptedData = await instance.encrypt_uint16(Number(value));
      break;
    case "uint32":
      encryptedData = await instance.encrypt_uint32(Number(value));
      break;
    case "uint64":
      encryptedData = await instance.encrypt_uint64(BigInt(value));
      break;
    case "uint128":
      encryptedData = await instance.encrypt_uint128(BigInt(value));
      break;
    case "uint256":
      encryptedData = await instance.encrypt_uint256(BigInt(value));
      break;
    case "address":
      encryptedData = await instance.encrypt_address(String(value));
      break;
    default:
      throw new Error(`Unsupported encryption type: ${type}`);
  }
  return {
    data: encryptedData,
    handles
  };
}
var EncryptionHelper = class {
  constructor(instance) {
    this.instance = instance;
  }
  async encrypt(value, type) {
    return encryptInput(this.instance, value, type);
  }
  async encryptBool(value) {
    return this.encrypt(value, "bool");
  }
  async encryptUint8(value) {
    return this.encrypt(value, "uint8");
  }
  async encryptUint16(value) {
    return this.encrypt(value, "uint16");
  }
  async encryptUint32(value) {
    return this.encrypt(value, "uint32");
  }
  async encryptUint64(value) {
    return this.encrypt(value, "uint64");
  }
  async encryptUint128(value) {
    return this.encrypt(value, "uint128");
  }
  async encryptUint256(value) {
    return this.encrypt(value, "uint256");
  }
  async encryptAddress(value) {
    return this.encrypt(value, "address");
  }
};

// src/decrypt.ts
async function userDecrypt(options) {
  const { contractAddress, handle, signer } = options;
  const provider = signer.provider;
  const network = provider ? await provider.getNetwork() : { chainId: 31337n };
  const domain = {
    name: "FHEVM",
    version: "1",
    chainId: Number(network.chainId),
    verifyingContract: contractAddress
  };
  const types = {
    Reencrypt: [
      { name: "handle", type: "bytes32" }
    ]
  };
  const value = {
    handle
  };
  try {
    await signer.signTypedData(domain, types, value);
    return BigInt(0);
  } catch (error) {
    throw new Error(`Failed to decrypt: ${error}`);
  }
}
async function publicDecrypt(options) {
  const { contractAddress, handle } = options;
  console.log(`Public decrypt for contract ${contractAddress}, handle ${handle}`);
  return BigInt(0);
}
export {
  EncryptionHelper,
  FhevmClientImpl,
  createFhevmInstance,
  encryptInput,
  publicDecrypt,
  userDecrypt
};
//# sourceMappingURL=index.mjs.map