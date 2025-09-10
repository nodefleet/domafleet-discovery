import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Marketplace: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Original Marketplace - Doma Protocol"
        description="The original marketplace interface for Doma Protocol domains"
        keywords="domain marketplace, blockchain domains, original interface"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Original Marketplace
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              This is the original marketplace interface. We've enhanced the experience with our new marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Enhanced Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/community"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                Community Deals
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-blue-600 mb-4">
                  <TrendingUp className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Experience</h3>
                <p className="text-gray-600">
                  Our new marketplace offers better filtering, real-time data, and improved user experience.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-green-600 mb-4">
                  <DollarSign className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Trading</h3>
                <p className="text-gray-600">
                  Advanced trading features with real-time offers, secure transactions, and progress tracking.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-purple-600 mb-4">
                  <Users className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Features</h3>
                <p className="text-gray-600">
                  Connect with other traders, join community deals, and participate in domain fractionalization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;
