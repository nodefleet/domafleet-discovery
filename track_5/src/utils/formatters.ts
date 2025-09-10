// Utility functions for formatting data in the Doma Protocol application

/**
 * Format Ether values from wei to readable format
 */
export function formatEther(wei: string | bigint): string {
  try {
    const value = typeof wei === 'string' ? BigInt(wei) : wei;
    const ether = Number(value) / Math.pow(10, 18);
    
    if (ether === 0) return '0';
    if (ether < 0.0001) return '<0.0001';
    if (ether < 1) return ether.toFixed(4);
    if (ether < 1000) return ether.toFixed(2);
    
    return ether.toLocaleString('en-US', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 0 
    });
  } catch (error) {
    console.error('Error formatting ether:', error);
    return '0';
  }
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: string | number, currency: string = 'ETH'): string {
  try {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return `0 ${currency}`;
    
    if (numPrice === 0) return `0 ${currency}`;
    if (numPrice < 0.0001) return `<0.0001 ${currency}`;
    
    return `${formatEther(BigInt(Math.floor(numPrice * Math.pow(10, 18))))} ${currency}`;
  } catch (error) {
    console.error('Error formatting price:', error);
    return `0 ${currency}`;
  }
}

/**
 * Format Ethereum address for display
 */
export function formatAddress(address: string, length: number = 6): string {
  if (!address || address.length < 10) return address;
  
  const start = address.slice(0, length);
  const end = address.slice(-4);
  return `${start}...${end}`;
}

/**
 * Format time ago from timestamp
 */
export function formatTimeAgo(timestamp: number | string): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return 'Unknown';
  }
}

/**
 * Get domain category based on name characteristics
 */
export function getDomainCategory(name: string): string {
  if (!name) return 'unknown';
  
  if (name.length <= 3) return 'premium';
  if (name.length === 4) return 'short';
  if (/^\d+$/.test(name)) return 'numeric';
  if (/^[a-z]+$/.test(name)) return 'alphabetic';
  if (/\d/.test(name) && /[a-z]/.test(name)) return 'alphanumeric';
  
  return 'standard';
}

/**
 * Check if domain is expired
 */
export function isExpired(expirationDate: string | number): boolean {
  try {
    const expiry = typeof expirationDate === 'string' 
      ? new Date(expirationDate) 
      : new Date(expirationDate * 1000);
    
    return expiry.getTime() < Date.now();
  } catch (error) {
    console.error('Error checking expiration:', error);
    return false;
  }
}

/**
 * Calculate time remaining until expiration
 */
export function getTimeRemaining(expirationDate: string | number): string {
  try {
    const expiry = typeof expirationDate === 'string' 
      ? new Date(expirationDate) 
      : new Date(expirationDate * 1000);
    
    const now = new Date();
    const diffInMs = expiry.getTime() - now.getTime();
    
    if (diffInMs <= 0) return 'Expired';
    
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 30) return `${Math.floor(days / 30)} months`;
    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    
    return 'Less than 1 hour';
  } catch (error) {
    console.error('Error calculating time remaining:', error);
    return 'Unknown';
  }
}
