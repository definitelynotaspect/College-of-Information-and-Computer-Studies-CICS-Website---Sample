import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import cicsLogo from '../assets/cics-logo.png'
import { defaultFaculty, emptyFaculty, loadFaculty, saveFaculty } from '../utils/faculty'

const FACULTY_DRAFT_KEY = 'cics_dashboard_faculty_draft_v1'

function loadFacultyDraft() {
  try {
    const stored = localStorage.getItem(FACULTY_DRAFT_KEY)
    return stored ? { ...emptyFaculty, ...JSON.parse(stored) } : emptyFaculty
  } catch {
    return emptyFaculty
  }
}

export default function FacultyAdmin() {
  const { user, logout } = useAuth()
  const [faculty, setFaculty] = useState(loadFaculty)
  const [notice, setNotice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(loadFacultyDraft)

  const showNotice = (message) => {
    setNotice(message)
    setTimeout(() => setNotice(''), 3200)
  }

  const persist = (nextFaculty, message) => {
    try {
      saveFaculty(nextFaculty)
      setFaculty(nextFaculty)
      showNotice(message)
    } catch {
      showNotice('Changes could not be saved. Try a smaller image.')
    }
  }

  useEffect(() => {
    if (editingId) return
    try {
      localStorage.setItem(FACULTY_DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* ignore draft save errors */
    }
  }, [editingId, form])

  const clearForm = () => {
    setForm(emptyFaculty)
    setEditingId(null)
    setFormOpen(false)
  }

  const closeForm = () => {
    if (editingId) {
      setForm(loadFacultyDraft())
      setEditingId(null)
    }
    setFormOpen(false)
  }

  const openAddForm = () => {
    setEditingId(null)
    setFormOpen(true)
  }

  const openEditForm = (member) => {
    setForm({ ...emptyFaculty, ...member })
    setEditingId(member.id)
    setFormOpen(true)
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showNotice('Please choose an image file.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotice('Please choose an image smaller than 2 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onerror = () => showNotice('The photo could not be read.')
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((current) => ({ ...current, photo: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.fullName.trim() || !form.position.trim() || !form.email.trim()) {
      showNotice('Please fill in the required fields.')
      return
    }

    const payload = {
      ...form,
      id: editingId || `${form.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      photo: form.photo || '/cics-logo.png',
    }

    const nextFaculty = editingId
      ? faculty.map((member) => (member.id === editingId ? payload : member))
      : [payload, ...faculty]

    persist(nextFaculty, editingId ? 'Faculty profile updated.' : 'Faculty profile added.')
    if (!editingId) localStorage.removeItem(FACULTY_DRAFT_KEY)
    clearForm()
  }

  const handleDelete = (member) => {
    if (!window.confirm(`Delete ${member.fullName} from the faculty directory?`)) return
    persist(faculty.filter((item) => item.id !== member.id), 'Faculty profile deleted.')
  }

  const restoreDefaults = () => {
    persist(defaultFaculty, 'Default faculty directory restored.')
    clearForm()
  }

  return (
    <div className="site-shell dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="dash-brand">
            <img src={cicsLogo} alt="CICS seal" />
            <span>
              <b>CICS Administration</b>
              <small>Faculty Directory Management</small>
            </span>
          </div>
          <div className="account">
            <span>Welcome, {user?.displayName}</span>
            <Link to="/faculty">View Faculty</Link>
            <Link to="/dashboard">Content Dashboard</Link>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <p className="kicker">ADMINISTRATOR DASHBOARD</p>
        <div className="admin-heading">
          <div>
            <h1>Manage Faculty</h1>
            <p className="dashboard-lead">
              Add, edit, or delete faculty profiles shown in the public faculty directory.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="primary compact-button" onClick={openAddForm}>Add Faculty +</button>
            <button className="faculty-text-button" onClick={restoreDefaults}>Restore Defaults</button>
          </div>
        </div>

        <div className="admin-program-list">
          {faculty.map((member) => (
            <article key={member.id}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <img
                  src={member.photo}
                  alt={member.fullName}
                  style={{ width: 72, height: 72, objectFit: 'cover', objectPosition: 'top center', borderRadius: 8, background: '#e7edf5', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <p className="kicker">{member.position}</p>
                  <h2>{member.fullName}</h2>
                  <p>{member.researchInterests}</p>
                  <small>{member.email}</small>
                </div>
              </div>
              <div className="admin-program-actions">
                <button onClick={() => openEditForm(member)}>Edit</button>
                <button className="delete-action" onClick={() => handleDelete(member)}>Delete</button>
              </div>
            </article>
          ))}
          {!faculty.length && <p className="about-empty">No faculty profiles found. Add your first profile to begin.</p>}
        </div>
      </main>

      {formOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeForm}>
          <section
            className="auth-modal faculty-form-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="close" onClick={closeForm} aria-label="Close">x</button>
            <h2>{editingId ? 'Edit Faculty' : 'Add Faculty'}</h2>
            <p className="modal-copy">Fields marked with * are required.</p>
            <form onSubmit={handleSubmit}>
              <label>
                Faculty Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              {form.photo && <img className="faculty-form-preview" src={form.photo} alt="Faculty preview" />}
              <label>
                Full Name *
                <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
              </label>
              <label>
                Position *
                <input value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} required />
              </label>
              <label>
                Educational Background
                <textarea value={form.educationalBackground} onChange={(event) => setForm({ ...form, educationalBackground: event.target.value })} rows={3} />
              </label>
              <label>
                Research Interests
                <textarea value={form.researchInterests} onChange={(event) => setForm({ ...form, researchInterests: event.target.value })} rows={3} />
              </label>
              <label>
                Email Address *
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              </label>
              <label>
                Office Hours
                <input value={form.officeHours} onChange={(event) => setForm({ ...form, officeHours: event.target.value })} />
              </label>
              <label>
                Professional Certifications
                <textarea value={form.certifications} onChange={(event) => setForm({ ...form, certifications: event.target.value })} rows={3} />
              </label>
              <div className="faculty-form-actions">
                <button className="primary" type="submit">{editingId ? 'Save Changes' : 'Add Faculty'}</button>
                <button type="button" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}
