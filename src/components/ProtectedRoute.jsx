import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'
import { useState } from 'react'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: '#102b55' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#102b55' }}>
        <h2 style={{ marginBottom: 12 }}>Access Restricted</h2>
        <p style={{ color: '#647188', marginBottom: 24 }}>
          You need to log in with an authorized account to access this page.
        </p>
        <button
          className="primary"
          style={{ width: 'auto', padding: '13px 30px', display: 'inline-block' }}
          onClick={() => setShowLogin(true)}
        >
          Log In
        </button>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    )
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#102b55' }}>
        <h2 style={{ marginBottom: 12 }}>Insufficient Permissions</h2>
        <p style={{ color: '#647188' }}>
          Your account does not have the required role to access this page.
        </p>
      </div>
    )
  }

  return children
}