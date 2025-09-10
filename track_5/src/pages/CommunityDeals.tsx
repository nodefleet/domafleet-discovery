import React from 'react';
import { Users, PieChart, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const CommunityDeals: React.FC = () => {
  const communityDeals = [
    {
      id: '1',
      title: 'Premium 3-Letter Domains Collection',
      description: 'A curated collection of premium 3-letter domains including abc.doma, xyz.doma, and more.',
      totalValue: '50.0',
      participants: 12,
      minInvestment: '1.0',
      timeLeft: '5 days',
      progress: 75,
      category: 'Collection',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Crypto Keywords Bundle',
      description: 'High-value cryptocurrency and blockchain related domains perfect for Web3 businesses.',
      totalValue: '25.0',
      participants: 8,
      minInvestment: '0.5',
      timeLeft: '2 days',
      progress: 45,
      category: 'Bundle',
      status: 'Active'
    },
    {
      id: '3',
      title: 'Gaming Domains Vault',
      description: 'Popular gaming-related domains including game.doma, play.doma, and esports.doma.',
      totalValue: '15.0',
      participants: 15,
      minInvestment: '0.25',
      timeLeft: 'Completed',
      progress: 100,
      category: 'Gaming',
      status: 'Completed'
    }
  ];

  return (
    <>
      <SEOHead
        title="Community Deals - Collaborative Domain Investment"
        description="Join community-driven domain deals and fractionalized ownership opportunities on the Doma Protocol platform."
        keywords="community deals, domain fractionalization, collaborative investment, blockchain domains"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Deals</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Participate in collaborative domain investments and fractionalized ownership opportunities. 
                Pool resources with other investors to acquire premium domains.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">35</div>
                  <div className="text-sm text-gray-600">Active Participants</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">90.0 ETH</div>
                  <div className="text-sm text-gray-600">Total Pool Value</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Active Deals</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">125%</div>
                  <div className="text-sm text-gray-600">Avg. ROI</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Community Deals Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pool Resources</h3>
                <p className="text-gray-600">
                  Join with other investors to pool funds for acquiring premium domains that would be too expensive individually.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Ownership</h3>
                <p className="text-gray-600">
                  Receive fractionalized ownership tokens representing your share of the domain(s) in the deal.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Returns</h3>
                <p className="text-gray-600">
                  Benefit from domain appreciation, rental income, and community-driven decisions on domain usage.
                </p>
              </div>
            </div>
          </div>

          {/* Active Deals */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Community Deals</h2>
            
            {communityDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{deal.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {deal.status}
                      </span>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {deal.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{deal.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Total Value</div>
                        <div className="text-lg font-semibold text-gray-900">{deal.totalValue} ETH</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Participants</div>
                        <div className="text-lg font-semibold text-gray-900">{deal.participants}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Min. Investment</div>
                        <div className="text-lg font-semibold text-gray-900">{deal.minInvestment} ETH</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Time Left</div>
                        <div className="text-lg font-semibold text-gray-900">{deal.timeLeft}</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Funding Progress</span>
                        <span>{deal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${deal.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:ml-6 lg:flex-shrink-0">
                    {deal.status === 'Active' ? (
                      <div className="flex flex-col space-y-2">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                          Join Deal
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    ) : (
                      <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Risk Notice */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Investment Risk Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Community deals involve investment risks. Domain values can fluctuate, and there's no guarantee of returns. 
                  Only invest what you can afford to lose and carefully review all deal terms before participating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityDeals;
