import axios, { AxiosInstance } from 'axios';

// Enhanced Doma Protocol API Client
// Provides similar functionality to the official SDK but using REST API directly

export type Caip2ChainId = `eip155:${number}`;

export interface OrderbookConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface CreateListingParams {
  contractAddress: string;
  tokenId: string;
  price: string;
  currencyContractAddress?: string;
  expirationTime?: number;
  chainId?: Caip2ChainId;
}

export interface CreateOfferParams {
  contractAddress: string;
  tokenId: string;
  price: string;
  currencyContractAddress: string;
  expirationTime?: number;
  chainId?: Caip2ChainId;
}

export interface BuyListingParams {
  orderId: string;
  chainId?: Caip2ChainId;
}

export interface AcceptOfferParams {
  orderId: string;
  chainId?: Caip2ChainId;
}

export interface CancelListingParams {
  orderId: string;
  chainId?: Caip2ChainId;
}

export interface CancelOfferParams {
  orderId: string;
  chainId?: Caip2ChainId;
}

export interface GetOrderbookFeeParams {
  contractAddress: string;
  orderbook?: OrderbookType;
  chainId?: Caip2ChainId;
}

export interface GetSupportedCurrenciesParams {
  contractAddress: string;
  orderbook?: OrderbookType;
  chainId?: Caip2ChainId;
}

export enum OrderbookType {
  DOMA = 'DOMA',
  OPENSEA = 'OPENSEA'
}

export interface GetOrderbookFeeResponse {
  fees: {
    protocolFee: number;
    royaltyFee: number;
    totalFee: number;
  };
}

export interface GetSupportedCurrenciesResponse {
  currencies: Array<{
    symbol: string;
    contractAddress: string;
    decimals: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export type ProgressCallback = (step: string, percentage: number) => void;

export class EnhancedDomaClient {
  private apiClient: AxiosInstance;
  private apiKey?: string;

  constructor(config: OrderbookConfig) {
    this.apiKey = config.apiKey;
    this.apiClient = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Api-Key': config.apiKey }),
      },
    });

    // Add response interceptor for consistent error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Enhanced Doma Client Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async createListing(params: CreateListingParams, onProgress?: ProgressCallback): Promise<ApiResponse<{ orderId: string }>> {
    try {
      onProgress?.('Preparing listing...', 10);
      
      const payload = {
        contractAddress: params.contractAddress,
        tokenId: params.tokenId,
        price: params.price,
        currencyContractAddress: params.currencyContractAddress || '0x0000000000000000000000000000000000000000',
        expirationTime: params.expirationTime || Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        orderbook: OrderbookType.DOMA,
        chainId: params.chainId || 'eip155:97476',
      };

      onProgress?.('Creating listing...', 50);
      
      const response = await this.apiClient.post('/orderbook/listings', payload);
      
      onProgress?.('Listing created successfully', 100);
      
      return {
        success: true,
        data: { orderId: response.data.orderId || response.data.id }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create listing',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async createOffer(params: CreateOfferParams, onProgress?: ProgressCallback): Promise<ApiResponse<{ orderId: string }>> {
    try {
      onProgress?.('Preparing offer...', 10);
      
      const payload = {
        contractAddress: params.contractAddress,
        tokenId: params.tokenId,
        price: params.price,
        currencyContractAddress: params.currencyContractAddress,
        expirationTime: params.expirationTime || Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        orderbook: OrderbookType.DOMA,
        chainId: params.chainId || 'eip155:97476',
      };

      onProgress?.('Creating offer...', 50);
      
      const response = await this.apiClient.post('/orderbook/offers', payload);
      
      onProgress?.('Offer created successfully', 100);
      
      return {
        success: true,
        data: { orderId: response.data.orderId || response.data.id }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create offer',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async buyListing(params: BuyListingParams, onProgress?: ProgressCallback): Promise<ApiResponse> {
    try {
      onProgress?.('Preparing purchase...', 10);
      
      const payload = {
        orderId: params.orderId,
        chainId: params.chainId || 'eip155:97476',
      };

      onProgress?.('Processing purchase...', 50);
      
      const response = await this.apiClient.post('/orderbook/listings/buy', payload);
      
      onProgress?.('Purchase completed', 100);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to buy listing',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async acceptOffer(params: AcceptOfferParams, onProgress?: ProgressCallback): Promise<ApiResponse> {
    try {
      onProgress?.('Preparing to accept offer...', 10);
      
      const payload = {
        orderId: params.orderId,
        chainId: params.chainId || 'eip155:97476',
      };

      onProgress?.('Accepting offer...', 50);
      
      const response = await this.apiClient.post('/orderbook/offers/accept', payload);
      
      onProgress?.('Offer accepted', 100);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to accept offer',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async cancelListing(params: CancelListingParams, onProgress?: ProgressCallback): Promise<ApiResponse> {
    try {
      onProgress?.('Cancelling listing...', 50);
      
      const response = await this.apiClient.delete(`/orderbook/listings/${params.orderId}`);
      
      onProgress?.('Listing cancelled', 100);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to cancel listing',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async cancelOffer(params: CancelOfferParams, onProgress?: ProgressCallback): Promise<ApiResponse> {
    try {
      onProgress?.('Cancelling offer...', 50);
      
      const response = await this.apiClient.delete(`/orderbook/offers/${params.orderId}`);
      
      onProgress?.('Offer cancelled', 100);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to cancel offer',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async getOrderbookFees(params: GetOrderbookFeeParams): Promise<ApiResponse<GetOrderbookFeeResponse>> {
    try {
      const response = await this.apiClient.get('/orderbook/fees', {
        params: {
          contractAddress: params.contractAddress,
          orderbook: params.orderbook || OrderbookType.DOMA,
          chainId: params.chainId || 'eip155:97476',
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get orderbook fees',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }

  async getSupportedCurrencies(params: GetSupportedCurrenciesParams): Promise<ApiResponse<GetSupportedCurrenciesResponse>> {
    try {
      const response = await this.apiClient.get('/orderbook/currencies', {
        params: {
          contractAddress: params.contractAddress,
          orderbook: params.orderbook || OrderbookType.DOMA,
          chainId: params.chainId || 'eip155:97476',
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get supported currencies',
        code: error.response?.data?.code || 'UNKNOWN_ERROR'
      };
    }
  }
}

export const createEnhancedDomaClient = (apiKey?: string) => {
  return new EnhancedDomaClient({
    baseUrl: process.env.REACT_APP_DOMA_API_BASE_URL || 'https://api-testnet.doma.xyz',
    apiKey: apiKey,
  });
};

export const enhancedDomaClient = createEnhancedDomaClient(process.env.REACT_APP_DOMA_API_KEY);
