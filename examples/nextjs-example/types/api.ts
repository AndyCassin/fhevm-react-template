/**
 * API type definitions for Next.js routes
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode?: number;
  details?: any;
}

export interface FheApiRoutes {
  '/api/fhe': {
    GET: ApiResponse<{
      message: string;
      endpoints: Record<string, string>;
    }>;
    POST: ApiResponse<{
      publicKey?: string;
      valid?: boolean;
      chainId?: bigint;
    }>;
  };

  '/api/fhe/encrypt': {
    GET: ApiResponse<{
      message: string;
      usage: any;
    }>;
    POST: ApiResponse<{
      encryptedData: number[];
      handles: string[];
      type: string;
      timestamp: string;
    }>;
  };

  '/api/fhe/decrypt': {
    GET: ApiResponse<{
      message: string;
      usage: any;
    }>;
    POST: ApiResponse<{
      decryptedValue: bigint | string;
      handle: string;
      contractAddress: string;
      timestamp: string;
    }>;
  };

  '/api/fhe/compute': {
    GET: ApiResponse<{
      message: string;
      capabilities: string[];
    }>;
    POST: ApiResponse<{
      result: string;
      operation: string;
      method: string;
      timestamp: string;
    }>;
  };

  '/api/keys': {
    GET: ApiResponse<{
      publicKeyLength: number;
      publicKeyHash: string;
      network: {
        chainId: string;
        name: string;
      };
    }>;
    POST: ApiResponse<{
      message?: string;
      publicKey?: string;
      valid?: boolean;
    }>;
  };
}

export type ApiEndpoint = keyof FheApiRoutes;

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
}
