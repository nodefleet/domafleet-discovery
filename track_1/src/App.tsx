import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { TrackOne } from './pages/TrackOne'
import Marketplace from './pages/Marketplace'
import NameDetail from './pages/NameDetail'

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={< Marketplace />} />
          <Route path="/track-1" element={<TrackOne />} />
          <Route path="/market" element={<Marketplace />} />
          <Route path="/name/:name" element={<NameDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}


