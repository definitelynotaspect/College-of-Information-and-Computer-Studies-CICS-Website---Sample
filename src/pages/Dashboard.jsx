import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import { Link } from 'react-router-dom'
import cicsLogo from '../assets/cics-logo.png'
import { getNewsImage } from '../utils/newsImages'

const CONTENT_CATEGORIES = [
  { value: 'News', label: 'News' },
  { value: 'Events', label: 'Events' },
  { value: 'Dean', label: "Dean's Message" },
  { value: 'Welcome', label: 'Welcome' },
  { value: 'History', label: 'History' },
  { value: 'Vision', label: 'Vision' },
  { value: 'Mission', label: 'Mission' },
  { value: 'Goals', label: 'Goals' },
  { value: 'CoreValues', label: 'Core Values' },
  { value: 'OrganizationalChart', label: 'Organizational Chart' },
  { value: 'Recognitions', label: 'Recognitions' },
]

const categoryLabel = (value) => CONTENT_CATEGORIES.find((category) => category.value === value)?.label || value

const Arrow = () => <span aria-hidden="true">→</span>

const CONTENT_DRAFT_KEY = 'cics_dashboard_content_draft_v1'

function loadFormDraft(defaultForm) {
  try {
    const stored = localStorage.getItem(CONTENT_DRAFT_KEY)
    return stored ? { ...defaultForm, ...JSON.parse(stored) } : defaultForm
  } catch {
    return defaultForm
  }
}

const contentActions = [
  {
    title: 'General Website Content',
    label: 'Create Content',
    description: 'Post homepage, About, vision, mission, goals, recognitions, events, and other college page content.',
    kind: 'button',
  },
  {
    title: 'Academic Programs',
    label: 'Manage Programs',
    description: 'Add programs, update curriculum details, and upload downloadable curriculum PDFs.',
    to: '/dashboard/programs',
  },
  {
    title: 'Faculty Directory',
    label: 'Manage Faculty',
    description: 'Create faculty profiles with photos, contact details, research interests, and office hours.',
    to: '/dashboard/faculty',
  },
  {
    title: 'News & Announcements',
    label: 'Manage News',
    description: 'Publish news stories, pin important updates, manage drafts, and archive old posts.',
    to: '/dashboard/news',
  },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { items, addItem, updateItem, deleteItem, togglePublish, storageError } = useContent()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const emptyForm = () => ({ title: '', category: 'News', body: '', date: new Date().toISOString().split('T')[0], published: true, imageUrl: '', imageStorageKey: '', imageAlt: '' })
  const [form, setForm] = useState(() => loadFormDraft(emptyForm()))
  const [filter, setFilter] = useState('All')
  const [showContentActions, setShowContentActions] = useState(false)

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  useEffect(() => {
    if (editingId) return
    try {
      localStorage.setItem(CONTENT_DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* ignore draft save errors */
    }
  }, [editingId, form])

  const clearForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(false)
  }

  const closeForm = () => {
    if (editingId) {
      setForm(loadFormDraft(emptyForm()))
      setEditingId(null)
    }
    setShowForm(false)
  }

  const openAddContent = () => {
    setEditingId(null)
    setShowForm(true)
    setShowContentActions(false)
  }

  const openEdit = (item) => {
    setForm({ title: item.title, category: item.category, body: item.body, date: item.date || new Date().toISOString().split('T')[0], published: item.published, imageUrl: item.imageUrl || '', imageStorageKey: item.imageStorageKey || '', imageAlt: item.imageAlt || '' })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      showNotice('Please fill in all required fields.')
      return
    }
    const saved = editingId ? updateItem(editingId, form) : addItem(form)
    if (!saved) {
      showNotice('Content was not saved. Use a smaller image or remove an older uploaded image, then try again.')
      return
    }
    showNotice(editingId ? 'Content updated successfully.' : 'Content added successfully.')
    if (!editingId) localStorage.removeItem(CONTENT_DRAFT_KEY)
    clearForm()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showNotice('Please choose an image file.')
      e.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotice('Please choose an image smaller than 2 MB.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onerror = () => showNotice('The image could not be read. Please try a different file.')
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        showNotice('The image could not be read. Please try a different file.')
        return
      }
      setForm((current) => ({ ...current, imageUrl: reader.result, imageStorageKey: '', imageAlt: current.imageAlt || file.name.replace(/\.[^.]+$/, '') }))
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (deleteItem(id)) showNotice('Content deleted.')
      else showNotice('Content could not be deleted because browser storage is unavailable.')
    }
  }

  const handlePublishToggle = (id) => {
    if (!togglePublish(id)) showNotice('Publish status could not be saved. Please try again.')
  }

  const isSuperAdmin = user?.role === 'Super Administrator'
  const isEditor = user?.role === 'College Dean' || isSuperAdmin

  const filteredItems = filter === 'All' ? items : items.filter((i) => i.category === filter)
  // Show all supported content types, even before an administrator creates an item.
  const categories = ['All', ...CONTENT_CATEGORIES.map((category) => category.value)]
  const selectedImage = getNewsImage({
    id: editingId,
    title: form.title,
    imageUrl: form.imageUrl,
    imageStorageKey: form.imageStorageKey,
    imageAlt: form.imageAlt,
  })

  if (!isEditor) {
    return (
      <div className="site-shell">
        <header className="dashboard-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="dash-brand">
              <img src={cicsLogo} alt="CICS seal" />
              <span>
                <b>CICS Administration</b>
                <small>College Website Management</small>
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
            Only the College Dean and Super Administrator can access the Content Management Dashboard.
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
                <small>College Website Management</small>
            </span>
          </div>
          <div className="account">
            <span>Welcome, {user?.displayName}</span>
            <Link to="/" style={{ color: '#cfdaeb', fontSize: 12, marginRight: 12 }}>View Site</Link>
            {isSuperAdmin && (
              <Link to="/admin/settings" style={{ color: '#e4a52e', fontSize: 12, marginRight: 12, fontWeight: 600 }}>
                System Settings
              </Link>
            )}
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <p className="kicker">ADMINISTRATOR DASHBOARD</p>
        <div className="dashboard-hero-row">
          <div>
            <h1>Content Management</h1>
            <p className="dashboard-lead">
              Add, edit, delete, and publish website content from one organized workspace.
            </p>
          </div>
          <button
            className="primary dashboard-add-toggle"
            type="button"
            aria-expanded={showContentActions}
            onClick={() => setShowContentActions((current) => !current)}
          >
            Add New Content <Arrow />
          </button>
        </div>

        {showContentActions && (
          <section className="content-action-panel" aria-label="Add new content options">
            <div className="content-action-panel-header">
              <p className="kicker">CONTENT TYPES</p>
              <h2>Choose what you want to manage</h2>
            </div>
            <div className="content-action-grid">
              {contentActions.map((action) => (
                <article className="content-action-card" key={action.title}>
                  <div>
                    <span className="content-action-mark" aria-hidden="true">{action.title.slice(0, 2).toUpperCase()}</span>
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  {action.kind === 'button' ? (
                    <button type="button" onClick={openAddContent}>{action.label}</button>
                  ) : (
                    <Link to={action.to}>{action.label}</Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, margin: '24px 0', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? '#0b326a' : 'transparent',
                color: filter === cat ? '#fff' : '#647188',
                border: filter === cat ? 'none' : '1px solid #cbd0d8',
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 0,
              }}
            >
              {cat === 'All' ? 'All' : categoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Content Form Modal */}
        {showForm && (
          <div className="modal-backdrop" role="presentation" onClick={closeForm}>
            <section
              className="auth-modal"
              role="dialog"
              aria-modal="true"
              style={{ width: 'min(100%, 560px)', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close" onClick={closeForm} aria-label="Close">×</button>
              <h2 style={{ marginBottom: 0 }}>
                {editingId ? 'Edit Content' : 'Add New Content'}
              </h2>
              <p className="modal-copy" style={{ marginTop: 8 }}>
                Fields marked with * are required.
              </p>

              <form onSubmit={handleSubmit}>
                <label>
                  Title *
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter title"
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: 7,
                      padding: 12,
                      color: '#162d52',
                      background: '#fff',
                      border: '1px solid #cbd0d8',
                      outlineColor: '#e0a12c',
                    }}
                  >
                    {CONTENT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Body *
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Enter content body"
                    required
                    rows={4}
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
                <label>
                  {form.category === 'Events' ? 'Event Date' : 'Published Date'}
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </label>
                {(form.category === 'News' || form.category === 'OrganizationalChart') && (
                  <>
                    <label>
                      {form.category === 'News' ? 'News Photo' : 'Organizational Chart Image'}
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                      <small style={{ display: 'block', marginTop: 6, color: '#647188' }}>Upload a JPG, PNG, WEBP, or other image up to 2 MB.</small>
                    </label>
                    {selectedImage && (
                      <div style={{ marginTop: 8 }}>
                        <img src={selectedImage.src} alt={selectedImage.alt} style={{ width: '100%', height: 150, objectFit: 'cover', border: '1px solid #cbd0d8' }} />
                        {(form.imageUrl || form.imageStorageKey) && <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageStorageKey: '', imageAlt: '' })} style={{ ...actionBtnStyle, marginTop: 8, color: '#b91c1c' }}>Remove uploaded image</button>}
                      </div>
                    )}
                    <label>
                      Image Description
                      <input value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} placeholder="Describe the image for accessibility" />
                    </label>
                  </>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  Publish immediately
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="primary" type="submit" style={{ flex: 1 }}>
                    {editingId ? 'Update' : 'Publish'} <Arrow />
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
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

        {/* Content Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0ede5', textAlign: 'left' }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #deddd5' }}>
                  <td style={tdStyle}>
                    <strong>{item.title}</strong>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      background: item.category === 'News' ? '#dbeafe' : item.category === 'Events' ? '#fef3c7' : item.category === 'Dean' ? '#ede9fe' : '#e0f2fe',
                      color: item.category === 'News' ? '#1e40af' : item.category === 'Events' ? '#92400e' : item.category === 'Dean' ? '#5b21b6' : '#0369a1',
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {categoryLabel(item.category)}
                    </span>
                  </td>
                  <td style={tdStyle}>{item.date}</td>
                  <td style={tdStyle}>
                    <span style={{
                      color: item.published ? '#15803d' : '#b91c1c',
                      fontWeight: 600,
                      fontSize: 12,
                    }}>
                      {item.published ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button
                        onClick={() => openEdit(item)}
                        style={actionBtnStyle}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublishToggle(item.id)}
                        style={{
                          ...actionBtnStyle,
                          color: item.published ? '#92400e' : '#15803d',
                        }}
                      >
                        {item.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ ...actionBtnStyle, color: '#b91c1c' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#647188' }}>
                    No content found. Click "Add New Content" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {(notice || storageError) && <div className="toast" role="status">{notice || storageError}</div>}
    </div>
  )
}

const thStyle = {
  padding: '12px 14px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
  color: '#647188',
}

const tdStyle = {
  padding: '14px 14px',
  verticalAlign: 'middle',
}

const actionBtnStyle = {
  background: 'none',
  border: '1px solid #cbd0d8',
  padding: '5px 10px',
  fontSize: 11,
  fontWeight: 600,
  color: '#0b326a',
  cursor: 'pointer',
}
