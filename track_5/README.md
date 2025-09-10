# Doma Protocol Domain Marketplace

A comprehensive domain marketplace and messaging platform built for the Doma Protocol ecosystem. This application provides a modern, intuitive interface for buying, selling, and trading domains on the blockchain with integrated messaging capabilities.

## Features

### 🏪 Enhanced Marketplace
- **Real-time Domain Listings**: Browse and discover domains with live data from the Doma Protocol
- **Advanced Filtering**: Filter by category, price range, expiration status, and more
- **SEO-Optimized Pages**: Custom landing pages for each domain with rich metadata
- **Mobile-Responsive Design**: Fully responsive interface built with Tailwind CSS

### 💰 Trading & Orderbook
- **Integrated Trading**: Create listings and offers directly from the interface
- **Progress Tracking**: Real-time progress updates for all trading operations
- **Multi-Currency Support**: Support for various payment currencies
- **Secure Transactions**: All trades secured by blockchain smart contracts

### 💬 Trade Messaging
- **Encrypted Communication**: End-to-end encrypted messaging using XMTP protocol
- **Domain-Specific Chats**: Dedicated chat rooms for each domain trade
- **Real-time Messaging**: Instant communication between buyers and sellers

### 🤝 Community Deals
- **Collaborative Investment**: Pool resources with other investors for premium domains
- **Fractionalized Ownership**: Share ownership through blockchain-based tokens
- **Community Governance**: Participate in decisions about domain usage and sales

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **API Integration**: 
  - GraphQL (via graphql-request) for Doma Subgraph
  - REST API (via axios) for Doma Protocol API
- **SEO**: React Helmet Async for dynamic meta tags
- **Icons**: Lucide React
- **Blockchain Integration**: Custom Doma Protocol client

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Doma Protocol API Configuration
   REACT_APP_DOMA_API_BASE_URL=https://api-testnet.doma.xyz
   REACT_APP_DOMA_API_KEY=your_api_key_here
   
   # Doma Protocol Subgraph
   REACT_APP_DOMA_SUBGRAPH_URL=https://api-testnet.doma.xyz/graphql
   
   # Doma Protocol RPC
   REACT_APP_DOMA_RPC_URL=https://rpc-testnet.doma.xyz
   
   # Chain Configuration
   REACT_APP_CHAIN_ID=eip155:97476
   REACT_APP_NETWORK_NAME=Doma Testnet
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── SEOHead.tsx     # SEO meta tags component
│   └── EnhancedOrderbookInterface.tsx
├── pages/              # Page components
│   ├── EnhancedMarketplace.tsx
│   ├── DomainLanding.tsx
│   ├── TradeMessaging.tsx
│   └── CommunityDeals.tsx
├── hooks/              # Custom React hooks
│   ├── useDomainData.ts
│   └── useEnhancedDoma.ts
├── lib/                # API clients and utilities
│   ├── doma-client.ts
│   ├── enhanced-doma-client.ts
│   └── graphql-queries.ts
├── utils/              # Utility functions
│   └── formatters.ts
└── App.tsx             # Main application component
```

## API Integration

### Doma Protocol APIs

The application integrates with multiple Doma Protocol APIs:

- **Subgraph API**: GraphQL endpoint for querying domain data, ownership, and activities
- **REST API**: RESTful endpoints for trading operations, offers, and listings
- **RPC**: Direct blockchain interaction for contract calls

### Data Sources

- **Domain Data**: Fetched from Doma Subgraph with real-time updates
- **Market Data**: Live pricing and trading information
- **Activity History**: Complete transaction and activity logs
- **Statistics**: Market analytics and trending data

## Trading Features

### Creating Listings
- Set custom prices and expiration times
- Support for multiple currencies
- Automatic fee calculation
- Progress tracking throughout the process

### Making Offers
- Submit offers on any domain
- Flexible expiration settings
- Escrow protection
- Counteroffer capabilities

### Secure Trading
- Smart contract-based escrow
- Automatic ownership transfer
- Fee transparency
- Transaction history

## Messaging System

### XMTP Integration
- End-to-end encrypted messaging
- Decentralized communication
- Domain-specific chat rooms
- Real-time delivery

### Trade Negotiations
- Secure offer discussions
- Document sharing capabilities
- Verification tools
- History preservation

## Community Features

### Investment Pools
- Collaborative domain acquisition
- Fractional ownership tokens
- Transparent governance
- Automated profit distribution

### Community Governance
- Voting on domain usage
- Revenue sharing decisions
- Platform improvements
- Community guidelines

## Development

### Available Scripts

- `npm start` - Runs the development server
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint for code quality

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

This project uses:
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   - Static hosting (Netlify, Vercel, GitHub Pages)
   - CDN deployment
   - Docker containerization

3. **Environment Variables**
   Ensure all production environment variables are set:
   - API endpoints
   - API keys
   - Chain configuration

### Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Bundle analysis with webpack-bundle-analyzer
- Service worker for caching

## Support

For questions, issues, or contributions:

- **Documentation**: Comprehensive guides and API references
- **Issues**: GitHub Issues for bug reports and feature requests
- **Community**: Join our community discussions
- **API Support**: Doma Protocol API documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Doma Protocol Team**: For the comprehensive API and infrastructure
- **React Community**: For the excellent ecosystem and tools
- **Open Source Contributors**: For the libraries and tools that make this possible

---

Built with ❤️ for the Doma Protocol ecosystem.