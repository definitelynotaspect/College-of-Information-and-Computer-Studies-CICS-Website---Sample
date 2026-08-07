import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import cicsLogo from '../assets/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function LoginModal({ onClose }) {
  const { login, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
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
      navigate('/dashboard')
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
                <span className="password-field">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    title={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 8.8 4.1 9.8 8-0.4 1.4-1.1 2.7-2.1 3.8M6.2 6.2C4.3 7.6 2.9 9.7 2.2 12c1 3.9 4.6 8 9.8 8 1.3 0 2.5-.2 3.6-.7" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.2 12S5.8 4 12 4s9.8 8 9.8 8-3.6 8-9.8 8S2.2 12 2.2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </span>
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
