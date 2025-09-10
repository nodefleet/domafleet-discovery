import { useState, useEffect, useCallback } from 'react';
import { graphqlClient } from '../lib/doma-client';
import {
  GET_DOMAINS,
  GET_DOMAIN,
  GET_NAME_STATISTICS,
  GET_LISTINGS,
  GET_OFFERS,
  GET_TOKEN_ACTIVITIES,
  GET_NAME_ACTIVITIES,
} from '../lib/graphql-queries';

// Types for domain data based on Doma schema
export interface DomainListResponse {
  names: {
    items: DomaName[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface DomaName {
  name: string;
  expiresAt: string;
  tokenizedAt: string;
  eoi: boolean;
  transferLock?: boolean;
  claimedBy?: string;
  registrar: {
    name: string;
    ianaId: string;
  };
  tokens: DomaToken[];
  activities?: DomaNameActivity[];
}

export interface DomaToken {
  tokenId: string;
  networkId: string;
  ownerAddress: string;
  type: string;
  startsAt?: string;
  expiresAt: string;
  createdAt: string;
  explorerUrl: string;
  tokenAddress: string;
  chain: {
    name: string;
    networkId: string;
  };
  listings: DomaListing[];
  activities?: DomaTokenActivity[];
}

export interface DomaListing {
  id: string;
  externalId: string;
  price: string;
  offererAddress: string;
  orderbook: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  expiresAt: string;
  createdAt: string;
}

export interface DomaOffer {
  id: string;
  externalId: string;
  price: string;
  offererAddress: string;
  orderbook: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  expiresAt: string;
  createdAt: string;
  name: string;
  nameExpiresAt: string;
  registrar: {
    name: string;
    ianaId: string;
  };
  tokenId: string;
  tokenAddress: string;
  chain: {
    name: string;
    networkId: string;
  };
}

export interface DomaTokenActivity {
  type: string;
  createdAt: string;
  tokenId?: string;
  txHash?: string;
  networkId?: string;
  finalized?: boolean;
  transferredTo?: string;
  transferredFrom?: string;
  orderId?: string;
  startsAt?: string;
  seller?: string;
  buyer?: string;
  payment?: {
    price: string;
    tokenAddress: string;
    currencySymbol: string;
  };
  orderbook?: string;
  purchasedAt?: string;
}

export interface DomaNameActivity {
  type: string;
  createdAt: string;
  sld?: string;
  tld?: string;
  claimedBy?: string;
  txHash?: string;
  networkId?: string;
}

export interface DomaNameStatistics {
  name: string;
  activeOffers: number;
  offersLast3Days: number;
  highestOffer?: DomaOffer;
}

// Legacy interfaces for backward compatibility
export interface Domain {
  id: string;
  name: string;
  tokenId: string;
  ownerAddress: string;
  createdAt: string;
  expiresAt: string;
  registrationCost: string;
  renewalCost: string;
  isListed: boolean;
  currentPrice?: string;
  listingId?: string;
  offers?: Offer[];
  activities?: Activity[];
}

export interface Offer {
  id: string;
  price: string;
  offerAddress: string;
  expiresAt: string;
  status: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  fromAddress: string;
  toAddress: string;
  price?: string;
  timestamp: string;
  transactionHash: string;
}

export interface DomainStatistics {
  totalDomains: number;
  totalVolume: string;
  totalSales: number;
  averagePrice: string;
  floorPrice: string;
  topSale: string;
}

export interface Listing {
  id: string;
  tokenId: string;
  price: string;
  seller: string;
  buyer?: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  domain: Domain;
}

// Helper function to convert DomaName to legacy Domain format
function convertDomaNameToDomain(domaName: DomaName): Domain {
  const firstToken = domaName.tokens[0];
  const firstListing = firstToken?.listings[0];
  
  return {
    id: domaName.name,
    name: domaName.name,
    tokenId: firstToken?.tokenId || '',
    ownerAddress: firstToken?.ownerAddress || '',
    createdAt: domaName.tokenizedAt,
    expiresAt: domaName.expiresAt,
    registrationCost: '0', // Not available in schema
    renewalCost: '0', // Not available in schema
    isListed: (firstToken?.listings || []).length > 0,
    currentPrice: firstListing?.price,
    listingId: firstListing?.id,
    offers: [], // Would need separate query
    activities: [], // Would need separate query
  };
}

// Hook to fetch multiple domains with pagination and filtering
export function useDomains(limit: number = 50, skip: number = 0, filters?: any) {
  const [data, setData] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data for now until API key is configured
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockDomains: Domain[] = [
        {
          id: '1',
          name: 'premium.doma',
          tokenId: '12345',
          ownerAddress: '0x1234567890123456789012345678901234567890',
          createdAt: '2024-01-15T10:00:00Z',
          expiresAt: '2025-01-15T10:00:00Z',
          registrationCost: '0.1',
          renewalCost: '0.05',
          isListed: true,
          currentPrice: '2.5',
          listingId: 'listing-123',
          offers: [],
          activities: [],
        },
        {
          id: '2',
          name: 'crypto.doma',
          tokenId: '12346',
          ownerAddress: '0x9876543210987654321098765432109876543210',
          createdAt: '2024-02-01T14:30:00Z',
          expiresAt: '2025-02-01T14:30:00Z',
          registrationCost: '0.08',
          renewalCost: '0.04',
          isListed: true,
          currentPrice: '1.8',
          listingId: 'listing-124',
          offers: [],
          activities: [],
        },
        {
          id: '3',
          name: 'web3.doma',
          tokenId: '12347',
          ownerAddress: '0x5555555555555555555555555555555555555555',
          createdAt: '2024-03-10T09:15:00Z',
          expiresAt: '2025-03-10T09:15:00Z',
          registrationCost: '0.12',
          renewalCost: '0.06',
          isListed: false,
          offers: [],
          activities: [],
        },
        {
          id: '4',
          name: 'nft.doma',
          tokenId: '12348',
          ownerAddress: '0x7777777777777777777777777777777777777777',
          createdAt: '2024-04-05T16:45:00Z',
          expiresAt: '2025-04-05T16:45:00Z',
          registrationCost: '0.15',
          renewalCost: '0.075',
          isListed: true,
          currentPrice: '3.2',
          listingId: 'listing-125',
          offers: [],
          activities: [],
        },
        {
          id: '5',
          name: 'defi.doma',
          tokenId: '12349',
          ownerAddress: '0x8888888888888888888888888888888888888888',
          createdAt: '2024-05-20T11:30:00Z',
          expiresAt: '2025-05-20T11:30:00Z',
          registrationCost: '0.09',
          renewalCost: '0.045',
          isListed: false,
          offers: [],
          activities: [],
        },
        {
          id: '6',
          name: 'dao.doma',
          tokenId: '12350',
          ownerAddress: '0x9999999999999999999999999999999999999999',
          createdAt: '2024-06-12T13:20:00Z',
          expiresAt: '2025-06-12T13:20:00Z',
          registrationCost: '0.11',
          renewalCost: '0.055',
          isListed: true,
          currentPrice: '2.1',
          listingId: 'listing-126',
          offers: [],
          activities: [],
        }
      ];

      // Apply basic filtering if provided
      let filteredDomains = mockDomains;
      if (filters?.name) {
        filteredDomains = filteredDomains.filter(domain => 
          domain.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      setData(filteredDomains.slice(skip, skip + limit));
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  }, [limit, skip, filters]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  return { data, loading, error, refetch: fetchDomains };
}

// Hook to fetch a single domain by name
export function useDomain(domainName: string) {
  const [data, setData] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomain = useCallback(async () => {
    if (!domainName) return;

    try {
      setLoading(true);
      setError(null);

      const response = await graphqlClient.request(GET_DOMAIN, { name: domainName });
      const result = response as { name: DomaName };
      
      if (result.name) {
        const domain = convertDomaNameToDomain(result.name);
        setData(domain);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error('Error fetching domain:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch domain');
    } finally {
      setLoading(false);
    }
  }, [domainName]);

  useEffect(() => {
    fetchDomain();
  }, [fetchDomain]);

  return { data, loading, error, refetch: fetchDomain };
}

// Hook to fetch domain statistics
export function useDomainStatistics(tokenId?: string) {
  const [data, setData] = useState<DomaNameStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!tokenId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await graphqlClient.request(GET_NAME_STATISTICS, { tokenId });
      const result = response as { nameStatistics: DomaNameStatistics };
      setData(result.nameStatistics || null);
    } catch (err) {
      console.error('Error fetching domain statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch domain statistics');
    } finally {
      setLoading(false);
    }
  }, [tokenId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { data, loading, error, refetch: fetchStatistics };
}

// Hook to fetch marketplace listings
export function useMarketplaceListings(limit: number = 50, skip: number = 0, filters?: any) {
  const [data, setData] = useState<DomaListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockListings: DomaListing[] = [
        {
          id: 'listing-123',
          externalId: 'ext-123',
          price: '2500000000000000000', // 2.5 ETH in wei
          offererAddress: '0x1234567890123456789012345678901234567890',
          orderbook: 'DOMA',
          currency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          expiresAt: '2025-01-15T10:00:00Z',
          createdAt: '2024-12-01T10:00:00Z',
        },
        {
          id: 'listing-124',
          externalId: 'ext-124',
          price: '1800000000000000000', // 1.8 ETH in wei
          offererAddress: '0x9876543210987654321098765432109876543210',
          orderbook: 'DOMA',
          currency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          expiresAt: '2025-02-01T14:30:00Z',
          createdAt: '2024-11-15T14:30:00Z',
        }
      ];

      setData(mockListings.slice(skip, skip + limit));
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch marketplace listings');
    } finally {
      setLoading(false);
    }
  }, [limit, skip, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { data, loading, error, refetch: fetchListings };
}

// Hook to fetch offers
export function useOffers(limit: number = 50, skip: number = 0, filters?: any) {
  const [data, setData] = useState<DomaOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockOffers: DomaOffer[] = [
        {
          id: 'offer-1',
          externalId: 'ext-offer-1',
          price: '2000000000000000000', // 2.0 ETH in wei
          offererAddress: '0x9876543210987654321098765432109876543210',
          orderbook: 'DOMA',
          currency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          expiresAt: '2024-12-31T23:59:59Z',
          createdAt: '2024-12-01T12:00:00Z',
          name: 'premium.doma',
          nameExpiresAt: '2025-01-15T10:00:00Z',
          registrar: {
            name: 'Doma Registrar',
            ianaId: '1001',
          },
          tokenId: '12345',
          tokenAddress: '0xcontract123',
          chain: {
            name: 'Doma Testnet',
            networkId: 'eip155:97476',
          },
        },
        {
          id: 'offer-2',
          externalId: 'ext-offer-2',
          price: '1500000000000000000', // 1.5 ETH in wei
          offererAddress: '0x5555555555555555555555555555555555555555',
          orderbook: 'DOMA',
          currency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          expiresAt: '2024-12-25T23:59:59Z',
          createdAt: '2024-11-28T15:30:00Z',
          name: 'premium.doma',
          nameExpiresAt: '2025-01-15T10:00:00Z',
          registrar: {
            name: 'Doma Registrar',
            ianaId: '1001',
          },
          tokenId: '12345',
          tokenAddress: '0xcontract123',
          chain: {
            name: 'Doma Testnet',
            networkId: 'eip155:97476',
          },
        }
      ];

      // Filter by tokenId if provided
      let filteredOffers = mockOffers;
      if (filters?.tokenId) {
        filteredOffers = filteredOffers.filter(offer => offer.tokenId === filters.tokenId);
      }

      setData(filteredOffers.slice(skip, skip + limit));
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  }, [limit, skip, filters]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return { data, loading, error, refetch: fetchOffers };
}

// Hook to fetch token activities
export function useTokenActivities(tokenId: string, limit: number = 50, skip: number = 0) {
  const [data, setData] = useState<DomaTokenActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!tokenId) return;

    try {
      setLoading(true);
      setError(null);

      const variables = {
        tokenId,
        take: limit,
        skip: skip,
        sortOrder: 'DESC',
      };

      const response = await graphqlClient.request(GET_TOKEN_ACTIVITIES, variables);
      const result = response as { tokenActivities: { items: DomaTokenActivity[] } };
      setData(result.tokenActivities?.items || []);
    } catch (err) {
      console.error('Error fetching token activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token activities');
    } finally {
      setLoading(false);
    }
  }, [tokenId, limit, skip]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { data, loading, error, refetch: fetchActivities };
}

// Hook to fetch name activities
export function useNameActivities(name: string, limit: number = 50, skip: number = 0) {
  const [data, setData] = useState<DomaNameActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!name) return;

    try {
      setLoading(true);
      setError(null);

      const variables = {
        name,
        take: limit,
        skip: skip,
        sortOrder: 'DESC',
      };

      const response = await graphqlClient.request(GET_NAME_ACTIVITIES, variables);
      const result = response as { nameActivities: { items: DomaNameActivity[] } };
      setData(result.nameActivities?.items || []);
    } catch (err) {
      console.error('Error fetching name activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch name activities');
    } finally {
      setLoading(false);
    }
  }, [name, limit, skip]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { data, loading, error, refetch: fetchActivities };
}
