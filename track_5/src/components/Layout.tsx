import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, TrendingUp, MessageCircle, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Marketplace', href: '/', icon: Globe, current: location.pathname === '/' },
    { name: 'Community', href: '/community', icon: TrendingUp, current: location.pathname === '/community' },
    { name: 'Trade Chat', href: '/trade-chat', icon: MessageCircle, current: location.pathname === '/trade-chat' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  Doma Protocol
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Doma Protocol</h3>
                <p className="text-gray-600 text-sm">
                  A comprehensive domain marketplace and messaging platform for the Doma ecosystem.
                  Built with React, TypeScript, and Tailwind CSS.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="/" className="hover:text-gray-900">Marketplace</Link></li>
                  <li><Link to="/community" className="hover:text-gray-900">Community</Link></li>
                  <li><Link to="/trade-chat" className="hover:text-gray-900">Trade Chat</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="https://docs.doma.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Documentation</a></li>
                  <li><a href="https://api-testnet.doma.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">API</a></li>
                  <li><a href="https://github.com/doma-protocol" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                © 2024 Doma Protocol. Built for the multi-chain domain ecosystem.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
