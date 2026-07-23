import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'
import Dashboard from './pages/Dashboard'
import FacultyPage from './pages/FacultyPage'
import AdminSettings from './pages/AdminSettings'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="site-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute roles={['College Dean', 'Super Administrator']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty"
            element={
              <ProtectedRoute roles={['Faculty Member', 'College Dean', 'Super Administrator']}>
                <FacultyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={['Super Administrator']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <main style={{ textAlign: 'center', padding: '100px 20px' }}>
                <p className="kicker">404</p>
                <h2>Page Not Found</h2>
                <p style={{ color: '#647188', marginTop: 12 }}>
                  The page you are looking for does not exist.
                </p>
                <a href="/" style={{ color: '#0b326a', fontWeight: 700, fontSize: 13, marginTop: 20, display: 'inline-block' }}>
                  ← Back to Home
                </a>
              </main>
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App