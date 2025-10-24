// src/react/FhevmProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

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

// src/react/FhevmProvider.tsx
var FhevmContext = createContext(void 0);
function FhevmProvider({
  provider,
  chainId,
  gatewayUrl,
  aclAddress,
  children
}) {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function initFhevm() {
      try {
        setIsLoading(true);
        setError(null);
        const fhevmClient = await createFhevmInstance({
          provider,
          chainId,
          gatewayUrl,
          aclAddress
        });
        if (mounted) {
          setClient(fhevmClient);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    }
    initFhevm();
    return () => {
      mounted = false;
    };
  }, [provider, chainId, gatewayUrl, aclAddress]);
  const value = {
    client,
    isLoading,
    isReady: !!client && !isLoading,
    error
  };
  return /* @__PURE__ */ React.createElement(FhevmContext.Provider, { value }, children);
}
function useFhevmContext() {
  const context = useContext(FhevmContext);
  if (context === void 0) {
    throw new Error("useFhevmContext must be used within a FhevmProvider");
  }
  return context;
}

// src/react/useFhevmClient.ts
import { useState as useState2, useEffect as useEffect2 } from "react";
function useFhevmClient(options = {}) {
  const [client, setClient] = useState2(null);
  const [isLoading, setIsLoading] = useState2(true);
  const [error, setError] = useState2(null);
  const { provider, chainId, gatewayUrl, aclAddress } = options;
  useEffect2(() => {
    if (!provider) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    async function initClient() {
      try {
        setIsLoading(true);
        setError(null);
        const fhevmClient = await createFhevmInstance({
          provider,
          chainId,
          gatewayUrl,
          aclAddress
        });
        if (mounted) {
          setClient(fhevmClient);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    }
    initClient();
    return () => {
      mounted = false;
    };
  }, [provider, chainId, gatewayUrl, aclAddress]);
  return {
    client,
    isLoading,
    isReady: !!client && !isLoading,
    error
  };
}

// src/react/useFhevmContract.ts
import { useEffect as useEffect3, useState as useState3 } from "react";
function useFhevmContract(options) {
  const { address, abi, withSigner = false } = options;
  const { client, isReady } = useFhevmContext();
  const [contract, setContract] = useState3(null);
  useEffect3(() => {
    if (!isReady || !client) {
      setContract(null);
      return;
    }
    async function createContract() {
      if (!client) return;
      try {
        if (withSigner) {
          const connectedContract = await client.getConnectedContract(address, abi);
          setContract(connectedContract);
        } else {
          const readOnlyContract = client.getContract(address, abi);
          setContract(readOnlyContract);
        }
      } catch (error) {
        console.error("Error creating contract:", error);
        setContract(null);
      }
    }
    createContract();
  }, [address, abi, withSigner, client, isReady]);
  return contract;
}

// src/react/useEncryptedInput.ts
import { useState as useState4, useCallback } from "react";

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

// src/react/useEncryptedInput.ts
function useEncryptedInput() {
  const { client, isReady } = useFhevmContext();
  const [isEncrypting, setIsEncrypting] = useState4(false);
  const [error, setError] = useState4(null);
  const encrypt = useCallback(
    async (value, type) => {
      if (!isReady || !client) {
        throw new Error("FHEVM client not ready");
      }
      try {
        setIsEncrypting(true);
        setError(null);
        const instance = client.getInstance();
        const encrypted = await encryptInput(instance, value, type);
        setIsEncrypting(false);
        return encrypted;
      } catch (err) {
        const error2 = err;
        setError(error2);
        setIsEncrypting(false);
        throw error2;
      }
    },
    [client, isReady]
  );
  return {
    encrypt,
    isEncrypting,
    error
  };
}

// src/react/useDecrypt.ts
import { useState as useState5, useCallback as useCallback2 } from "react";

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

// src/react/useDecrypt.ts
function useDecrypt() {
  const { client, isReady } = useFhevmContext();
  const [isDecrypting, setIsDecrypting] = useState5(false);
  const [result, setResult] = useState5(null);
  const [error, setError] = useState5(null);
  const decrypt = useCallback2(
    async (contractAddress, handle) => {
      if (!isReady || !client) {
        throw new Error("FHEVM client not ready");
      }
      try {
        setIsDecrypting(true);
        setError(null);
        const signer = await client.getSigner();
        const decrypted = await userDecrypt({
          contractAddress,
          handle,
          signer
        });
        setResult(decrypted);
        setIsDecrypting(false);
        return decrypted;
      } catch (err) {
        const error2 = err;
        setError(error2);
        setIsDecrypting(false);
        throw error2;
      }
    },
    [client, isReady]
  );
  return {
    decrypt,
    isDecrypting,
    result,
    error
  };
}
export {
  FhevmProvider,
  useDecrypt,
  useEncryptedInput,
  useFhevmClient,
  useFhevmContext,
  useFhevmContract
};
//# sourceMappingURL=index.mjs.map