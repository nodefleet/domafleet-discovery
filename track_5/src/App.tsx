import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Marketplace from './pages/Marketplace';
import EnhancedMarketplace from './pages/EnhancedMarketplace';
import DomainDetail from './pages/DomainDetail';
import DomainLanding from './pages/DomainLanding';
import TradeMessaging from './pages/TradeMessaging';
import CommunityDeals from './pages/CommunityDeals';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EnhancedMarketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/domain/:domainName" element={<DomainDetail />} />
            <Route path="/landing/:domainName" element={<DomainLanding />} />
            <Route path="/trade-chat" element={<TradeMessaging />} />
            <Route path="/community" element={<CommunityDeals />} />
            <Route path="/trending" element={<EnhancedMarketplace />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
