"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  FhevmProvider: () => FhevmProvider,
  useDecrypt: () => useDecrypt,
  useEncryptedInput: () => useEncryptedInput,
  useFhevmClient: () => useFhevmClient,
  useFhevmContext: () => useFhevmContext,
  useFhevmContract: () => useFhevmContract
});
module.exports = __toCommonJS(react_exports);

// src/react/FhevmProvider.tsx
var import_react = __toESM(require("react"));

// src/client.ts
var import_ethers = require("ethers");
var import_fhevmjs = require("fhevmjs");
var FhevmClientImpl = class {
  constructor(config) {
    this.instance = null;
    this.provider = config.provider;
    this.config = config;
  }
  async initialize() {
    if (this.instance) return;
    const chainId = this.config.chainId ?? (await this.provider.getNetwork()).chainId;
    this.instance = await (0, import_fhevmjs.createInstance)({
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
    return new import_ethers.Contract(address, abi, this.provider);
  }
  async getConnectedContract(address, abi) {
    const signer = await this.getSigner();
    return new import_ethers.Contract(address, abi, signer);
  }
};
async function createFhevmInstance(config) {
  const client = new FhevmClientImpl(config);
  await client.initialize();
  return client;
}

// src/react/FhevmProvider.tsx
var FhevmContext = (0, import_react.createContext)(void 0);
function FhevmProvider({
  provider,
  chainId,
  gatewayUrl,
  aclAddress,
  children
}) {
  const [client, setClient] = (0, import_react.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ import_react.default.createElement(FhevmContext.Provider, { value }, children);
}
function useFhevmContext() {
  const context = (0, import_react.useContext)(FhevmContext);
  if (context === void 0) {
    throw new Error("useFhevmContext must be used within a FhevmProvider");
  }
  return context;
}

// src/react/useFhevmClient.ts
var import_react2 = require("react");
function useFhevmClient(options = {}) {
  const [client, setClient] = (0, import_react2.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)(null);
  const { provider, chainId, gatewayUrl, aclAddress } = options;
  (0, import_react2.useEffect)(() => {
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
var import_react3 = require("react");
function useFhevmContract(options) {
  const { address, abi, withSigner = false } = options;
  const { client, isReady } = useFhevmContext();
  const [contract, setContract] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
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
var import_react4 = require("react");

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
  const [isEncrypting, setIsEncrypting] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  const encrypt = (0, import_react4.useCallback)(
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
var import_react5 = require("react");

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
  const [isDecrypting, setIsDecrypting] = (0, import_react5.useState)(false);
  const [result, setResult] = (0, import_react5.useState)(null);
  const [error, setError] = (0, import_react5.useState)(null);
  const decrypt = (0, import_react5.useCallback)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FhevmProvider,
  useDecrypt,
  useEncryptedInput,
  useFhevmClient,
  useFhevmContext,
  useFhevmContract
});
//# sourceMappingURL=index.js.map