import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { TrackOne } from './pages/TrackOne'
import Marketplace from './pages/Marketplace'
import NameDetail from './pages/NameDetail'

export default function App() {
  return (
    <div className="app-container relative overflow-hidden">
      {/* Global animated background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-light-blue/5 via-transparent to-blue-300/5"></div>
      <div className="pointer-events-none absolute top-10 left-[-40px] w-80 h-80 bg-light-blue/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="pointer-events-none absolute bottom-10 right-[-60px] w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
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


