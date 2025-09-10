import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  Clock,
  TrendingUp,
  MessageCircle,
  Shield,
  Star,
  Activity
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import EnhancedOrderbookInterface from '../components/EnhancedOrderbookInterface';
import { formatPrice, formatAddress, formatTimeAgo, getDomainCategory, getTimeRemaining } from '../utils/formatters';

// Mock domain data for the landing page
const mockDomainData = {
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
  category: getDomainCategory('premium'),
  description: 'A premium domain perfect for businesses and personal branding.',
  features: [
    'Short and memorable',
    'Premium category',
    'High SEO value',
    'Universal appeal'
  ],
  offers: [
    {
      id: 'offer-1',
      price: '2.0',
      offerAddress: '0x9876543210987654321098765432109876543210',
      expiresAt: '2024-12-31T23:59:59Z',
      status: 'active',
      createdAt: '2024-12-01T12:00:00Z'
    },
    {
      id: 'offer-2',
      price: '1.8',
      offerAddress: '0x5555555555555555555555555555555555555555',
      expiresAt: '2024-12-25T23:59:59Z',
      status: 'active',
      createdAt: '2024-11-28T15:30:00Z'
    }
  ],
  activities: [
    {
      id: 'activity-1',
      type: 'listing_created',
      fromAddress: '0x1234567890123456789012345678901234567890',
      toAddress: '',
      price: '2.5',
      timestamp: '2024-11-20T14:00:00Z',
      transactionHash: '0xabcdef1234567890'
    },
    {
      id: 'activity-2',
      type: 'offer_made',
      fromAddress: '0x9876543210987654321098765432109876543210',
      toAddress: '0x1234567890123456789012345678901234567890',
      price: '2.0',
      timestamp: '2024-12-01T12:00:00Z',
      transactionHash: '0x1234567890abcdef'
    }
  ]
};

const DomainLanding: React.FC = () => {
  const { domainName } = useParams<{ domainName: string }>();
  
  // In a real implementation, you would fetch the domain data based on domainName
  const domain = mockDomainData;

  const handleOfferCreated = (orderId: string) => {
    console.log('New offer created:', orderId);
    // In a real implementation, you would refresh the offers data
  };

  const handleListingCreated = (orderId: string) => {
    console.log('New listing created:', orderId);
    // In a real implementation, you would refresh the listing data
  };

  return (
    <>
      <SEOHead
        title={`${domain.name} - Premium Domain for Sale`}
        description={`${domain.description} Available for ${formatPrice(domain.currentPrice || '0')} on the Doma Protocol marketplace.`}
        keywords={`${domain.name}, domain for sale, premium domain, blockchain domain, ${domain.category} domain`}
        ogTitle={`${domain.name} - Premium Domain`}
        ogDescription={`${domain.description} Price: ${formatPrice(domain.currentPrice || '0')}`}
        ogImage={`/api/og-image/${domain.name}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": domain.name,
          "description": domain.description,
          "category": "Domain Name",
          "offers": {
            "@type": "Offer",
            "price": domain.currentPrice,
            "priceCurrency": "ETH",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Doma Protocol"
            }
          }
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Domain Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Globe className="w-8 h-8 text-blue-600 mr-3" />
                      <h1 className="text-3xl font-bold text-gray-900">{domain.name}</h1>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {domain.category}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Expires in {getTimeRemaining(domain.expiresAt)}
                      </span>
                    </div>
                  </div>
                  
                  {domain.isListed && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(domain.currentPrice || '0')}
                      </div>
                      <div className="text-sm text-green-600">Listed for sale</div>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 text-lg mb-6">{domain.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {domain.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Owner</label>
                      <p className="text-gray-900 font-mono">{formatAddress(domain.ownerAddress)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Token ID</label>
                      <p className="text-gray-900">{domain.tokenId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Registration Cost</label>
                      <p className="text-gray-900">{formatPrice(domain.registrationCost)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="text-gray-900">{formatTimeAgo(new Date(domain.createdAt).getTime() / 1000)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expires</label>
                      <p className="text-gray-900">{new Date(domain.expiresAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Renewal Cost</label>
                      <p className="text-gray-900">{formatPrice(domain.renewalCost)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Offers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Offers</h2>
                {domain.offers.length > 0 ? (
                  <div className="space-y-4">
                    {domain.offers.map((offer) => (
                      <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-semibold text-gray-900">{formatPrice(offer.price)}</div>
                            <div className="text-sm text-gray-600">
                              by {formatAddress(offer.offerAddress)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {formatTimeAgo(new Date(offer.createdAt).getTime() / 1000)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Expires {formatTimeAgo(new Date(offer.expiresAt).getTime() / 1000)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No offers yet. Be the first to make an offer!</p>
                )}
              </div>

              {/* Activity History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Activity History
                </h2>
                <div className="space-y-4">
                  {domain.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.type.replace('_', ' ').toUpperCase()}
                          {activity.price && ` for ${formatPrice(activity.price)}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          by {formatAddress(activity.fromAddress)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimeAgo(new Date(activity.timestamp).getTime() / 1000)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trading Interface */}
              <EnhancedOrderbookInterface
                domainName={domain.name}
                tokenId={domain.tokenId}
                contractAddress="0x..." // Would come from real domain data
                chainId="eip155:97476"
                onOfferCreated={handleOfferCreated}
                onListingCreated={handleListingCreated}
              />

              {/* Trade Chat */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Trade Chat
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Connect with the domain owner and other interested buyers to negotiate trades.
                </p>
                <Link
                  to={`/trade-chat?domain=${domain.name}`}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors text-center block"
                >
                  Start Chat
                </Link>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Secure Trading</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      All transactions are secured by blockchain smart contracts. Your funds are protected until the domain transfer is complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DomainLanding;
