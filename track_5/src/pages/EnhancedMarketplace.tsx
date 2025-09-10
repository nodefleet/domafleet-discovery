import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SortDesc, Heart, TrendingUp } from 'lucide-react';
import { useDomains, useMarketplaceListings } from '../hooks/useDomainData';
import { formatPrice, formatAddress, getDomainCategory, getTimeRemaining } from '../utils/formatters';
import SEOHead from '../components/SEOHead';

interface FilterState {
  category: string;
  priceRange: string;
  status: string;
  search: string;
}

const EnhancedMarketplace: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
    status: 'all',
    search: '',
  });

  const [sortBy, setSortBy] = useState<'price' | 'name' | 'expiry' | 'created'>('created');
  const [currentPage, setCurrentPage] = useState(1);
  const domainsPerPage = 20;

  // Fetch data
  const { data: domains, loading: domainsLoading, error: domainsError } = useDomains(100);
  const { data: listings, loading: listingsLoading } = useMarketplaceListings(100);

  // Process and filter domains
  const filteredDomains = useMemo(() => {
    if (!domains) return [];

    return domains.filter((domain) => {
      // Search filter
      if (filters.search && !domain.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all') {
        const category = getDomainCategory(domain.name);
        if (category !== filters.category) return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'listed' && !domain.isListed) return false;
        if (filters.status === 'expiring') {
          const timeRemaining = domain.expiresAt ? getTimeRemaining(domain.expiresAt) : '';
          const matchesStatus = Boolean(timeRemaining && timeRemaining.includes('day') && parseInt(timeRemaining) <= 30);
          if (!matchesStatus) return false;
        }
      }

      // Price range filter
      if (filters.priceRange !== 'all' && domain.currentPrice) {
        const price = parseFloat(domain.currentPrice);
        switch (filters.priceRange) {
          case 'under-1':
            if (price >= 1) return false;
            break;
          case '1-10':
            if (price < 1 || price >= 10) return false;
            break;
          case '10-100':
            if (price < 10 || price >= 100) return false;
            break;
          case 'over-100':
            if (price < 100) return false;
            break;
        }
      }

      return true;
    });
  }, [domains, filters]);

  // Sort domains
  const sortedDomains = useMemo(() => {
    if (!filteredDomains) return [];

    return [...filteredDomains].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = parseFloat(a.currentPrice || '0');
          const priceB = parseFloat(b.currentPrice || '0');
          return priceB - priceA;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'expiry':
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [filteredDomains, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedDomains.length / domainsPerPage);
  const paginatedDomains = sortedDomains.slice(
    (currentPage - 1) * domainsPerPage,
    currentPage * domainsPerPage
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (domainsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Marketplace</h2>
          <p className="text-gray-600">{domainsError}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Domain Marketplace - Buy, Sell & Trade Premium Domains"
        description="Discover and trade premium domains on the Doma Protocol marketplace. Find short domains, numeric domains, and premium names with secure blockchain transactions."
        keywords="domain marketplace, blockchain domains, premium domains, domain trading, NFT domains"
        ogImage="/marketplace-og.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "Marketplace",
          "name": "Doma Protocol Marketplace",
          "description": "Premium domain marketplace powered by blockchain technology",
          "url": window.location.href,
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Domain Marketplace</h1>
                <p className="mt-2 text-gray-600">
                  Discover and trade premium domains on the blockchain
                </p>
              </div>
              
              {/* Statistics */}
              {!domainsLoading && domains && (
                <div className="mt-6 lg:mt-0 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {domains.length.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Domains</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {domains.filter(d => d.isListed).length}
                    </div>
                    <div className="text-sm text-gray-600">Listed for Sale</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {domains.filter(d => d.currentPrice).length}
                    </div>
                    <div className="text-sm text-gray-600">With Prices</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search domains..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="premium">Premium (≤3 chars)</option>
                  <option value="short">Short (4 chars)</option>
                  <option value="numeric">Numeric</option>
                  <option value="alphabetic">Alphabetic</option>
                  <option value="standard">Standard</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="listed">Listed for Sale</option>
                  <option value="expiring">Expiring Soon</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created">Recently Added</option>
                  <option value="price">Price (High to Low)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="expiry">Expiring Soon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Domain Grid */}
          {domainsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedDomains.map((domain) => (
                  <Link
                    key={domain.id}
                    to={`/domain/${domain.name}`}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {domain.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {getDomainCategory(domain.name)}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Owner</span>
                          <span className="font-medium">{formatAddress(domain.ownerAddress)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Expires</span>
                          <span className="font-medium">{getTimeRemaining(domain.expiresAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {domain.isListed && domain.currentPrice ? (
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(domain.currentPrice)}
                            </div>
                            <div className="text-sm text-green-600">Listed for sale</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-600">Not for sale</div>
                            <div className="text-xs text-gray-500">Make an offer</div>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {domain.offers?.length || 0} offers
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!domainsLoading && sortedDomains.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EnhancedMarketplace;
