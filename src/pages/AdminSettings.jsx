import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import cicsLogo from '../assets/cics-logo.png'

const MOCK_USERS_DISPLAY = [
  { username: 'student', role: 'Student', displayName: 'Student User' },
  { username: 'faculty', role: 'Faculty Member', displayName: 'Faculty User' },
  { username: 'dean', role: 'College Dean', displayName: 'Dean User' },
  { username: 'admin', role: 'Super Administrator', displayName: 'Admin User' },
]

export default function AdminSettings() {
  const { user, logout } = useAuth()
  const [notice, setNotice] = useState('')
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('cics_settings')
      return stored ? JSON.parse(stored) : { siteName: 'College of Information and Computer Studies', maintenanceMode: false }
    } catch {
      return { siteName: 'College of Information and Computer Studies', maintenanceMode: false }
    }
  })

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    localStorage.setItem('cics_settings', JSON.stringify(updated))
    showNotice('Settings saved.')
  }

  if (user?.role !== 'Super Administrator') {
    return (
      <div className="site-shell">
        <header className="dashboard-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="dash-brand">
              <img src={cicsLogo} alt="CICS seal" />
              <span>
                <b>CICS Administration</b>
                <small>System Settings</small>
              </span>
            </div>
            <div className="account">
              <span>Welcome, {user?.displayName}</span>
              <Link to="/" style={{ color: '#cfdaeb', fontSize: 12, marginRight: 12 }}>View Site</Link>
              <button onClick={logout}>Log out</button>
            </div>
          </div>
        </header>
        <main className="dashboard-main container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <p className="kicker">ACCESS RESTRICTED</p>
          <h1>Insufficient Permissions</h1>
          <p className="dashboard-lead" style={{ margin: '0 auto' }}>
            Only the Super Administrator can access System Settings.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="site-shell">
      <header className="dashboard-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="dash-brand">
            <img src={cicsLogo} alt="CICS seal" />
            <span>
              <b>CICS Administration</b>
              <small>System Settings</small>
            </span>
          </div>
          <div className="account">
            <span>Welcome, {user?.displayName}</span>
            <Link to="/dashboard" style={{ color: '#cfdaeb', fontSize: 12, marginRight: 12 }}>CMS Dashboard</Link>
            <Link to="/" style={{ color: '#cfdaeb', fontSize: 12, marginRight: 12 }}>View Site</Link>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <p className="kicker">SUPER ADMINISTRATOR</p>
        <h1>System Settings</h1>
        <p className="dashboard-lead">
          Manage site configuration and user accounts.
        </p>

        {/* Site Settings */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-.04em',
            paddingBottom: 12,
            borderBottom: '1px solid #deddd5',
            marginBottom: 24,
          }}>
            Site Configuration
          </h2>

          <div style={{ maxWidth: 500 }}>
            <label style={{ marginBottom: 20 }}>
              Site Name
              <input
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                style={{ display: 'block', width: '100%', marginTop: 7, padding: 12, border: '1px solid #cbd0d8', outlineColor: '#e0a12c' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 400, marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                style={{ width: 'auto', margin: 0 }}
              />
              Enable Maintenance Mode
            </label>
          </div>
        </section>

        {/* User Management */}
        <section style={{ marginTop: 50 }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-.04em',
            paddingBottom: 12,
            borderBottom: '1px solid #deddd5',
            marginBottom: 24,
          }}>
            User Management
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f0ede5', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#647188' }}>Username</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#647188' }}>Display Name</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#647188' }}>Role</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#647188', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS_DISPLAY.map((u) => (
                  <tr key={u.username} style={{ borderBottom: '1px solid #deddd5' }}>
                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                      <strong>{u.username}</strong>
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>{u.displayName}</td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                      <span style={{
                        background: u.role === 'Super Administrator' ? '#fef3c7' : u.role === 'College Dean' ? '#ede9fe' : u.role === 'Faculty Member' ? '#dbeafe' : '#e0f2fe',
                        color: u.role === 'Super Administrator' ? '#92400e' : u.role === 'College Dean' ? '#5b21b6' : u.role === 'Faculty Member' ? '#1e40af' : '#0369a1',
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <span style={{ color: '#15803d', fontWeight: 600, fontSize: 12 }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: '#647188', fontSize: 12, marginTop: 12 }}>
            This is a mock user management table. In production, this would connect to a database for full CRUD operations.
          </p>
        </section>
      </main>

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}
