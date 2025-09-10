import { useState, useCallback, useEffect } from 'react';
import {
  enhancedDomaClient,
  type CreateListingParams,
  type CreateOfferParams,
  type ProgressCallback,
  type GetOrderbookFeeResponse,
  type GetSupportedCurrenciesResponse,
  type ApiResponse,
  type OrderbookType,
  type Caip2ChainId,
} from '../lib/enhanced-doma-client';

interface OperationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseOperationResult extends OperationState {
  execute: (...args: any[]) => Promise<any>;
  reset: () => void;
}

const useOperation = (
  operation: (...args: any[]) => Promise<any>
): UseOperationResult => {
  const [state, setState] = useState<OperationState>({
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState({ loading: true, error: null, success: false });

    try {
      const result = await operation(...args);
      setState({ loading: false, error: null, success: true });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ loading: false, error: errorMessage, success: false });
      throw error;
    }
  }, [operation]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, execute, reset };
};

// Hook for domain trading operations
export function useDomainTrading(contractAddress: string, tokenId: string) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (contractAddress && tokenId) {
      setIsInitialized(true);
    }
  }, [contractAddress, tokenId]);

  return {
    isInitialized,
    contractAddress,
    tokenId,
  };
}

// Hook for checking Doma client status
export function useDomaClientStatus() {
  const [status, setStatus] = useState({
    connected: false,
    apiKey: !!process.env.REACT_APP_DOMA_API_KEY,
    baseUrl: process.env.REACT_APP_DOMA_API_BASE_URL || 'https://api-testnet.doma.xyz',
  });

  useEffect(() => {
    // Simple connection check
    setStatus(prev => ({
      ...prev,
      connected: true, // Assume connected if client is initialized
    }));
  }, []);

  return status;
}

// Hook for progress tracking
export function useProgressTracker() {
  const [progress, setProgress] = useState({
    step: '',
    percentage: 0,
    active: false,
  });

  const createProgressCallback = useCallback((): ProgressCallback => {
    return (step: string, percentage: number) => {
      setProgress({
        step,
        percentage,
        active: percentage > 0 && percentage < 100,
      });
    };
  }, []);

  const reset = useCallback(() => {
    setProgress({
      step: '',
      percentage: 0,
      active: false,
    });
  }, []);

  const complete = useCallback(() => {
    setProgress({
      step: 'Completed',
      percentage: 100,
      active: false,
    });
  }, []);

  return {
    progress,
    createProgressCallback,
    reset,
    complete,
  };
}

// Hook for creating domain listings
export function useCreateListing() {
  return useOperation(async (params: CreateListingParams, onProgress?: ProgressCallback) => {
    return await enhancedDomaClient.createListing(params, onProgress);
  });
}

// Hook for creating domain offers
export function useCreateOffer() {
  return useOperation(async (params: CreateOfferParams, onProgress?: ProgressCallback) => {
    return await enhancedDomaClient.createOffer(params, onProgress);
  });
}

// Hook for buying listings
export function useBuyListing() {
  return useOperation(async (orderId: string, chainId?: Caip2ChainId, onProgress?: ProgressCallback) => {
    return await enhancedDomaClient.buyListing({ orderId, chainId }, onProgress);
  });
}

// Hook for accepting offers
export function useAcceptOffer() {
  return useOperation(async (orderId: string, chainId?: Caip2ChainId, onProgress?: ProgressCallback) => {
    return await enhancedDomaClient.acceptOffer({ orderId, chainId }, onProgress);
  });
}

// Hook for cancelling listings
export function useCancelListing() {
  return useOperation(async (orderId: string, chainId?: Caip2ChainId, onProgress?: ProgressCallback) => {
    return await enhancedDomaClient.cancelListing({ orderId, chainId }, onProgress);
  });
}

// Hook for cancelling offers
export function useCancelOffer() {
  return useOperation(async (orderId: string, chainId?: Caip2ChainId, onProgress?: ProgressCallback) => {
    return await enhancedDomaClient.cancelOffer({ orderId, chainId }, onProgress);
  });
}

// Hook for getting orderbook fees
export function useOrderbookFees(contractAddress: string, orderbook?: OrderbookType, chainId?: Caip2ChainId) {
  const [fees, setFees] = useState<GetOrderbookFeeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = useCallback(async () => {
    if (!contractAddress) return;

    try {
      setLoading(true);
      setError(null);

      const result = await enhancedDomaClient.getOrderbookFees({
        contractAddress,
        orderbook,
        chainId,
      });

      if (result.success && result.data) {
        setFees(result.data);
      } else {
        setError('Failed to fetch fees');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  }, [contractAddress, orderbook, chainId]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  return { fees, loading, error, refetch: fetchFees };
}

// Hook for getting supported currencies
export function useSupportedCurrencies(contractAddress: string, orderbook?: OrderbookType, chainId?: Caip2ChainId) {
  const [currencies, setCurrencies] = useState<GetSupportedCurrenciesResponse['currencies']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencies = useCallback(async () => {
    if (!contractAddress) return;

    try {
      setLoading(true);
      setError(null);

      const result = await enhancedDomaClient.getSupportedCurrencies({
        contractAddress,
        orderbook,
        chainId,
      });

      if (result.success && result.data) {
        setCurrencies(result.data.currencies || []);
      } else {
        setError('Failed to fetch currencies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  }, [contractAddress, orderbook, chainId]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return { currencies, loading, error, refetch: fetchCurrencies };
}
