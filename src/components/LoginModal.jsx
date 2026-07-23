import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import cicsLogo from '../assets/images/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function LoginModal({ onClose }) {
  const { login, forgotPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submitLogin = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await login(username.trim(), password)
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  const submitReset = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const msg = forgotPassword(email.trim())
      setMessage(msg)
    } catch (err) {
      setError(err.message)
    }
  }

  const showLogin = () => {
    setMode('login')
    setError('')
    setMessage('')
  }

  const showReset = () => {
    setMode('forgot')
    setError('')
    setMessage('')
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose} aria-label="Close">×</button>

        <img src={cicsLogo} alt="CICS seal" />

        {mode === 'login' ? (
          <>
            <p className="kicker">USER AUTHENTICATION</p>
            <h2 id="auth-title">Sign in to CICS</h2>
            <p className="modal-copy">
              Enter your authorized account details to access the dashboard.
            </p>

            <form onSubmit={submitLogin}>
              <label>
                Username
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </label>
              <label>
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                />
              </label>
              {error && <p className="form-message error">{error}</p>}
              {message && <p className="form-message success">{message}</p>}
              <button className="primary" type="submit">
                Log in <Arrow />
              </button>
            </form>

            <button className="link-button" onClick={showReset}>
              Forgot password?
            </button>
          </>
        ) : (
          <>
            <p className="kicker">ACCOUNT RECOVERY</p>
            <h2 id="auth-title">Forgot your password?</h2>
            <p className="modal-copy">
              Enter your registered email address and we'll send a password-reset link.
            </p>

            <form onSubmit={submitReset}>
              <label>
                Email address
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                />
              </label>
              {error && <p className="form-message error">{error}</p>}
              {message && (
                <p className={message.includes('sent') ? 'form-message success' : 'form-message error'}>
                  {message}
                </p>
              )}
              <button className="primary" type="submit">
                Send reset link <Arrow />
              </button>
            </form>

            <button className="link-button" onClick={showLogin}>
              ← Back to login
            </button>
          </>
        )}
      </section>
    </div>
  )
}