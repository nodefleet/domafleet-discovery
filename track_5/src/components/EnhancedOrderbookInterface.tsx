import React, { useState } from 'react';
import {
  DollarSign,
  Shield,
  AlertCircle,
  TrendingUp,
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  Wallet
} from 'lucide-react';
import { useOffers } from '../hooks/useDomainData';
import {
  useDomainTrading,
  useDomaClientStatus,
  useProgressTracker
} from '../hooks/useEnhancedDoma';
import { formatPrice, formatAddress } from '../utils/formatters';

interface EnhancedOrderbookInterfaceProps {
  domainName: string;
  tokenId: string;
  contractAddress: string;
  chainId: string;
  onOfferCreated?: (orderId: string) => void;
  onListingCreated?: (orderId: string) => void;
}

const EnhancedOrderbookInterface: React.FC<EnhancedOrderbookInterfaceProps> = ({
  domainName,
  tokenId,
  contractAddress,
  chainId,
  onOfferCreated,
  onListingCreated
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'offers'>('buy');
  const [listingPrice, setListingPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  // Enhanced hooks
  const trading = useDomainTrading(contractAddress, tokenId);
  const clientStatus = useDomaClientStatus();
  const { progress } = useProgressTracker();

  // Data hooks
  const {
    data: offersData,
    loading: offersLoading,
    error: offersError
  } = useOffers(10, 0, { tokenId: tokenId });

  const handleCreateListing = async () => {
    try {
      console.log('Creating listing for:', {
        domainName,
        tokenId,
        contractAddress,
        price: listingPrice
      });
      
      // TODO: Implement actual listing creation
      onListingCreated?.('mock-listing-id');
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  const handleCreateOffer = async () => {
    try {
      console.log('Creating offer for:', {
        domainName,
        tokenId,
        contractAddress,
        price: offerPrice
      });
      
      // TODO: Implement actual offer creation
      onOfferCreated?.('mock-offer-id');
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  };

  const tabs = [
    { id: 'buy' as const, name: 'Buy Now', icon: Wallet },
    { id: 'sell' as const, name: 'Create Listing', icon: DollarSign },
    { id: 'offers' as const, name: 'Make Offer', icon: TrendingUp },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Trade {domainName}
          </h3>
          <div className="flex items-center space-x-2">
            {clientStatus.connected ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        {progress.active && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm font-medium text-blue-900">{progress.step}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'buy' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Current Listings</h4>
                <p className="text-sm text-gray-600">
                  No active listings for this domain. Check back later or make an offer.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sell' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Price (ETH)
                </label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-yellow-800">Listing Fees</h5>
                    <p className="text-sm text-yellow-700 mt-1">
                      Platform fee: 2.5% • Gas fees may apply
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateListing}
                disabled={!listingPrice || !trading.isInitialized}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Listing
              </button>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price (ETH)
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleCreateOffer}
                disabled={!offerPrice || !trading.isInitialized}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Make Offer
              </button>

              {/* Current Offers */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Current Offers</h4>
                {offersLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : offersError ? (
                  <div className="text-red-600 text-sm">{offersError}</div>
                ) : offersData && offersData.length > 0 ? (
                  <div className="space-y-2">
                    {offersData.slice(0, 5).map((offer) => (
                      <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                        <div className="font-medium">{formatPrice(offer.price)}</div>
                        <div className="text-sm text-gray-600">
                          by {formatAddress(offer.offererAddress)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Active
                      </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No offers yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-gray-900">Secure Trading</h5>
              <p className="text-sm text-gray-600 mt-1">
                All transactions are secured by the Doma Protocol smart contracts on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOrderbookInterface;
