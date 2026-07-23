import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import { Link } from 'react-router-dom'
import cicsLogo from '../assets/images/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function FacultyPage() {
  const { user, logout } = useAuth()
  const { getPublished } = useContent()
  const [notice, setNotice] = useState('')
  const [uploads, setUploads] = useState(() => {
    try {
      const stored = localStorage.getItem('cics_faculty_uploads')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '' })

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  const newsItems = getPublished('News')

  const handleUpload = (e) => {
    e.preventDefault()
    if (!uploadForm.title.trim()) {
      showNotice('Please enter a research title.')
      return
    }
    const newUpload = {
      id: Date.now().toString(),
      ...uploadForm,
      uploadedBy: user?.displayName || 'Faculty',
      date: new Date().toISOString().split('T')[0],
    }
    const updated = [newUpload, ...uploads]
    setUploads(updated)
    localStorage.setItem('cics_faculty_uploads', JSON.stringify(updated))
    setUploadForm({ title: '', description: '' })
    setShowUploadForm(false)
    showNotice('Research uploaded successfully.')
  }

  return (
    <div className="site-shell">
      <header className="dashboard-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="dash-brand">
            <img src={cicsLogo} alt="CICS seal" />
            <span>
              <b>CICS Faculty Portal</b>
              <small>Announcements & Research</small>
            </span>
          </div>
          <div className="account">
            <span>Welcome, {user?.displayName}</span>
            <Link to="/" style={{ color: '#cfdaeb', fontSize: 12, marginRight: 12 }}>View Site</Link>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <p className="kicker">FACULTY PORTAL</p>
        <h1>Announcements & Research</h1>
        <p className="dashboard-lead">
          View college announcements and manage your research uploads.
        </p>

        {/* Announcements */}
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.04em', marginBottom: 16 }}>
            College Announcements
          </h2>
          <div style={{ display: 'grid', gap: 14 }}>
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <article
                  key={item.id}
                  style={{
                    padding: 22,
                    background: '#fffefa',
                    border: '1px solid #deddd5',
                    borderLeft: '6px solid #dfa02b',
                  }}
                >
                  <p style={{ color: '#cf7e12', font: '10px DM Mono', letterSpacing: '.12em', marginBottom: 8 }}>
                    COLLEGE ANNOUNCEMENT
                  </p>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.04em', marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#65738a', lineHeight: 1.6, fontSize: 14 }}>
                    {item.body}
                  </p>
                </article>
              ))
            ) : (
              <p style={{ color: '#647188' }}>No announcements available at this time.</p>
            )}
          </div>
        </section>

        {/* Research Uploads */}
        <section style={{ marginTop: 50 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.04em' }}>
              Research Uploads
            </h2>
            <button className="primary" style={{ width: 'auto', padding: '10px 18px', fontSize: 12 }} onClick={() => setShowUploadForm(true)}>
              Upload Research <Arrow />
            </button>
          </div>

          {uploads.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {uploads.map((u) => (
                <article
                  key={u.id}
                  style={{
                    padding: 18,
                    background: '#fffefa',
                    border: '1px solid #deddd5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{u.title}</h3>
                    {u.description && <p style={{ color: '#65738a', fontSize: 13, lineHeight: 1.5 }}>{u.description}</p>}
                    <p style={{ color: '#647188', fontSize: 11, marginTop: 6 }}>
                      Uploaded by {u.uploadedBy} on {u.date}
                    </p>
                  </div>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    Research
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: '#647188' }}>No research uploads yet. Click "Upload Research" to add one.</p>
          )}
        </section>
      </main>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowUploadForm(false)}>
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setShowUploadForm(false)} aria-label="Close">×</button>
            <h2 style={{ marginBottom: 0 }}>Upload Research</h2>
            <p className="modal-copy" style={{ marginTop: 8 }}>
              Share your research work with the college community.
            </p>

            <form onSubmit={handleUpload}>
              <label>
                Research Title *
                <input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Enter research title"
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Brief description of your research"
                  rows={3}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 7,
                    padding: 12,
                    color: '#162d52',
                    background: '#fff',
                    border: '1px solid #cbd0d8',
                    outlineColor: '#e0a12c',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </label>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="primary" type="submit" style={{ flex: 1 }}>
                  Upload <Arrow />
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: '1px solid #cbd0d8',
                    color: '#647188',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}