import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'
import cicsLogo from '../assets/images/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function Navbar() {
  const { user, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  if (isDashboard) return null

  return (
    <header className="header">
      <div className="container nav">
        <Link className="brand" to="/">
          <img src={cicsLogo} alt="College of Information and Computer Studies seal" />
          <span>
            <b>
              College of Information
              <br />
              and Computer Studies
            </b>
            <small>Interworld Colleges Foundation, Inc.</small>
          </span>
        </Link>

        <nav className="nav-links">
          <span className="nav-link">Admissions</span>
          <span className="nav-link">Programs</span>
          <span className="nav-link">Resources</span>
          <span className="nav-link">Contact</span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontSize: 12, color: '#647188' }}>{user.displayName}</span>
              <Link
                to="/dashboard"
                className="login-button"
                style={{ textDecoration: 'none', fontSize: 12, padding: '10px 14px' }}
              >
                Dashboard <Arrow />
              </Link>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: '1px solid #cbd0d8',
                  color: '#647188',
                  padding: '10px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <button className="login-button" onClick={() => setLoginOpen(true)}>
              Administrator Login <Arrow />
            </button>
          )}
        </div>
      </div>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </header>
  )
}