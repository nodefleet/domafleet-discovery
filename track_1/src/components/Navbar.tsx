import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/market" className="brand flex items-center gap-2">
          <img src="/logo_main.png" alt="Doma" className="w-6 h-6" />
          <span>Doma Discovery</span>
        </Link>
        <nav className="nav">
          <NavLink to="/market" className={({ isActive }) => isActive ? 'active' : ''}>
            <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <i className="fa-solid fa-store mr-2" /> Marketplace
            </motion.span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}


