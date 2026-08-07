import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'
import cicsLogo from '../assets/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function Navbar() {
  const { user, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20 )
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  if (isDashboard) return null

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav">
        <Link className="brand" to="/" onClick={closeMobile}>
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

        {/* Mobile menu overlay */}
        <div
          className={`mobile-menu-overlay${mobileOpen ? ' open' : ''}`}
          onClick={closeMobile}
          aria-hidden="true"
        />

        <nav className={`nav-links${mobileOpen ? ' open' : ''}`}>
          <Link className="nav-link" to="/" onClick={closeMobile}>Home</Link>
          <Link className="nav-link" to="/about" onClick={closeMobile}>About</Link>
          <Link className="nav-link" to="/programs" onClick={closeMobile}>Programs</Link>
          <Link className="nav-link" to="/faculty" onClick={closeMobile}>Faculty</Link>
          <Link className="nav-link" to="/news" onClick={closeMobile}>News</Link>
          <Link className="nav-link" to="/news#events" onClick={closeMobile}>Events</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span className="nav-user-name">{user.displayName}</span>
              <Link
                to="/dashboard"
                className="login-button"
                style={{ textDecoration: 'none', fontSize: 12, padding: '10px 14px' }}
                onClick={closeMobile}
              >
                Dashboard <Arrow />
              </Link>
              <button
                onClick={logout}
                className="logout-button"
              >
                Log out
              </button>
            </>
          ) : (
            <button className="login-button" onClick={() => setLoginOpen(true)}>
              Administrator Login <Arrow />
            </button>
          )}

          {/* Hamburger button */}
          <button
            className={`hamburger${mobileOpen ? ' active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </header>
  )
}
