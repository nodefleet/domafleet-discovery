import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getCartItems, CART_EVENTS, removeFromCart, clearCart } from '@/services/cart'

export function Navbar() {
  const [walletOpen, setWalletOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const wallets = [
    { icon: 'fa-brands fa-ethereum', label: '0x80...AB3A' },
    { icon: 'fa-brands fa-bitcoin', label: 'D5Wv...bpya' },
  ]
  const [cartItems, setCartItems] = useState(getCartItems())
  useEffect(() => {
    const handler = () => setCartItems(getCartItems())
    window.addEventListener(CART_EVENTS.UPDATED, handler)
    return () => window.removeEventListener(CART_EVENTS.UPDATED, handler)
  }, [])
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/market" className="brand flex items-center gap-2">
          <img src="/logo_main.png" alt="Doma" className="w-6 h-6" />
          <span>Doma Discovery</span>
        </Link>
        <nav className="nav flex items-center gap-3">
          <NavLink to="/market" className={({ isActive }) => isActive ? 'active' : ''}>
            <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <i className="fa-solid fa-store mr-2" /> Marketplace
            </motion.span>
          </NavLink>

          {/* Cart */}
          <div className="relative">
            <button id="navbar-cart-target" className="px-3 py-1.5 rounded-lg bg-dark-blue/40 border border-light-blue/30 text-white hover:border-light-blue relative"
              onClick={() => { setCartOpen((v) => !v); setWalletOpen(false) }}
            >
              <i className="fa-solid fa-cart-shopping mr-2"></i>
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-light-blue text-white rounded-full px-1.5 py-0.5">{cartItems.length}</span>
              )}
            </button>
            {cartOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-light-blue/30 bg-gradient-to-br from-dark-blue/80 to-navy-blue/70 p-4 shadow-xl z-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-200">Cart ({cartItems.length})</span>
                  <div className="flex items-center gap-2">
                    {cartItems.length > 0 && (
                      <button className="text-blue-300 hover:text-white text-xs" onClick={() => clearCart()}>Clear</button>
                    )}
                    <button className="text-blue-300 hover:text-white" onClick={() => setCartOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
                {cartItems.length === 0 ? (
                  <div className="text-sm text-blue-200">No items in cart</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {cartItems.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-blue/30 border border-light-blue/20 text-white">
                        <div>
                          <div className="text-sm">{it.name}</div>
                          <div className="text-xs text-blue-300">{it.type} {it.price ? `• ${it.price} ${it.currency ?? ''}` : ''}</div>
                        </div>
                        <button className="text-blue-300 hover:text-white" onClick={() => removeFromCart(idx)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/market" className="inline-flex items-center gap-2 text-light-blue hover:text-white text-sm mt-3">
                  <i className="fa-solid fa-bag-shopping"></i>
                  Continue shopping
                </Link>
              </div>
            )}
          </div>

          {/* Account / Wallets */}
          <div className="relative">
            <button className="px-3 py-1.5 rounded-lg bg-dark-blue/40 border border-light-blue/30 text-white hover:border-light-blue"
              onClick={() => { setWalletOpen((v) => !v); setCartOpen(false) }}
            >
              <i className="fa-solid fa-user mr-2"></i>
              Account
            </button>
            {walletOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-light-blue/30 bg-gradient-to-br from-dark-blue/80 to-navy-blue/70 p-4 shadow-xl z-50">
                <div className="mb-2">
                  <div className="text-white font-semibold mb-1">Wallet</div>
                  <div className="text-blue-300 text-sm">View and add your existing wallets here</div>
                </div>
                <button className="w-full mb-3 px-3 py-2 rounded-lg bg-dark-blue/40 border border-light-blue/30 text-white hover:border-light-blue text-left">
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add New Wallet
                </button>
                <div className="space-y-2">
                  {wallets.map((w, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-blue/30 border border-light-blue/20 text-white">
                      <div className="flex items-center gap-2">
                        <i className={`${w.icon} text-light-blue`}></i>
                        <span className="text-sm">{w.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300">
                        <button className="hover:text-white"><i className="fa-solid fa-copy"></i></button>
                        <button className="hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}


