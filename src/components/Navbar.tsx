import { Link, NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Doma Discovery</Link>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Inicio</NavLink>
          <NavLink to="/track-1" className={({ isActive }) => isActive ? 'active' : ''}>Track 1</NavLink>
          <NavLink to="/market" className={({ isActive }) => isActive ? 'active' : ''}>Marketplace</NavLink>
        </nav>
      </div>
    </header>
  )
}


