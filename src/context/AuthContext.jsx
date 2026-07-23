import { createContext, useContext, useState, useEffect } from 'react'

const MOCK_USERS = [
  { username: 'student', password: '123', role: 'Student', displayName: 'Student User' },
  { username: 'faculty', password: '123', role: 'Faculty Member', displayName: 'Faculty User' },
  { username: 'dean', password: '123', role: 'College Dean', displayName: 'Dean User' },
  { username: 'admin', password: '123', role: 'Super Administrator', displayName: 'Admin User' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cics_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('cics_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (!found) {
      throw new Error('Invalid username or password.')
    }
    const userData = { username: found.username, role: found.role, displayName: found.displayName }
    setUser(userData)
    localStorage.setItem('cics_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cics_user')
  }

  const forgotPassword = (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.')
    }
    return 'Password-reset instructions have been sent to your registered email.'
  }

  const canAccess = (roles) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, loading, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}