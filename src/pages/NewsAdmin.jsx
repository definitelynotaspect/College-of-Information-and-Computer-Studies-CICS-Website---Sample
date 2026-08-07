import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import cicsLogo from '../assets/cics-logo.png'
import { getNewsImage } from '../utils/newsImages'

const NEWS_CATEGORIES = ['Announcement', 'Event', 'Achievement', 'Scholarship', 'General']
const NEWS_DRAFT_KEY = 'cics_dashboard_news_draft_v1'

const Arrow = () => <span aria-hidden="true">→</span>

const emptyForm = () => ({
  title: '',
  newsCategory: 'Announcement',
  body: '',
  date: new Date().toISOString().split('T')[0],
  author: 'CICS Administration',
  published: true,
  pinned: false,
  archived: false,
  imageUrl: '',
  imageStorageKey: '',
  imageAlt: '',
})

function loadNewsDraft(defaultForm) {
  try {
    const stored = localStorage.getItem(NEWS_DRAFT_KEY)
    return stored ? { ...defaultForm, ...JSON.parse(stored) } : defaultForm
  } catch {
    return defaultForm
  }
}

export default function NewsAdmin() {
  const { user, logout } = useAuth()
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    togglePublish,
    archiveItem,
    togglePin,
    storageError,
  } = useContent()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(() => loadNewsDraft(emptyForm()))
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState('')

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  useEffect(() => {
    if (editingId) return
    try {
      localStorage.setItem(NEWS_DRAFT_KEY, JSON.stringify(form))
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
      setForm(loadNewsDraft(emptyForm()))
      setEditingId(null)
    }
    setShowForm(false)
  }

  const newsItems = items.filter((item) => item.category === 'News')

  const openAdd = () => {
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setForm({
      title: item.title,
      newsCategory: item.newsCategory || 'General',
      body: item.body,
      date: item.date || new Date().toISOString().split('T')[0],
      author: item.author || 'CICS Administration',
      published: item.published,
      pinned: item.pinned,
      archived: item.archived,
      imageUrl: item.imageUrl || '',
      imageStorageKey: item.imageStorageKey || '',
      imageAlt: item.imageAlt || '',
    })
    setEditingId(item.id)
    setShowForm(true)
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
      if (typeof reader.result === 'string') {
        setForm((current) => ({
          ...current,
          imageUrl: reader.result,
          imageStorageKey: '',
          imageAlt: current.imageAlt || file.name.replace(/\.[^.]+$/, ''),
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      showNotice('Please fill in the title and description.')
      return
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      author: form.author.trim() || 'CICS Administration',
    }

    const saved = editingId ? updateItem(editingId, payload) : addItem({ ...payload, category: 'News' })
    if (!saved) {
      showNotice('News was not saved. Use a smaller image or remove an older uploaded image, then try again.')
      return
    }
    showNotice(editingId ? 'News updated successfully.' : 'News published successfully.')
    if (!editingId) localStorage.removeItem(NEWS_DRAFT_KEY)
    clearForm()
  }

  const handleDelete = (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return
    if (deleteItem(item.id)) showNotice('News deleted.')
    else showNotice('News could not be deleted because browser storage is unavailable.')
  }

  const handleArchive = (item) => {
    archiveItem(item.id)
    showNotice(item.archived ? 'News restored from archive.' : 'News archived.')
  }

  const handlePin = (item) => {
    togglePin(item.id)
    showNotice(item.pinned ? 'News unpinned.' : 'News pinned as important.')
  }

  const filteredNews = newsItems.filter((item) => {
    if (filter === 'All') return true
    if (filter === 'Pinned') return item.pinned
    if (filter === 'Archived') return item.archived
    if (filter === 'Published') return item.published && !item.archived
    if (filter === 'Draft') return !item.published && !item.archived
    return true
  })

  const categoryBadge = (item) => {
    const labels = {
      Announcement: { background: '#dbeafe', color: '#1e40af' },
      Event: { background: '#fef3c7', color: '#92400e' },
      Achievement: { background: '#dcfce7', color: '#166534' },
      Scholarship: { background: '#ede9fe', color: '#5b21b6' },
      General: { background: '#e0f2fe', color: '#0369a1' },
    }
    const style = labels[item.newsCategory] || labels.General
    return (
      <span style={{ background: style.background, color: style.color, padding: '3px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {item.newsCategory || 'General'}
      </span>
    )
  }

  return (
    <div className="site-shell dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="dash-brand">
            <img src={cicsLogo} alt="CICS seal" />
            <span>
              <b>CICS Administration</b>
              <small>News &amp; Announcements Management</small>
            </span>
          </div>
          <div className="account">
            <span>Welcome, {user?.displayName}</span>
            <Link to="/news">View News</Link>
            <Link to="/dashboard">Content Dashboard</Link>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <p className="kicker">ADMINISTRATOR DASHBOARD</p>
        <div className="admin-heading">
          <div>
            <h1>News &amp; Announcements</h1>
            <p className="dashboard-lead">
              Create, edit, delete, archive, and pin important news for the college website.
            </p>
          </div>
          <button className="primary compact-button" onClick={openAdd}>
            Add News + <Arrow />
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, margin: '24px 0', flexWrap: 'wrap' }}>
          {['All', 'Published', 'Draft', 'Pinned', 'Archived'].map((cat) => (
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
              {cat}
            </button>
          ))}
        </div>

        {/* News table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0ede5', textAlign: 'left' }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Author</th>
                <th style={thStyle}>Date Posted</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #deddd5', opacity: item.archived ? 0.6 : 1 }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <strong>{item.title}</strong>
                      {item.pinned && (
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 7px', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                          📌 Pinned
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={tdStyle}>{categoryBadge(item)}</td>
                  <td style={tdStyle}>{item.author || '—'}</td>
                  <td style={tdStyle}>{item.date || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ color: item.archived ? '#647188' : item.published ? '#15803d' : '#b91c1c', fontWeight: 600, fontSize: 12 }}>
                      {item.archived ? 'Archived' : item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => openEdit(item)} style={actionBtnStyle}>Edit</button>
                      <button onClick={() => handlePin(item)} style={{ ...actionBtnStyle, color: item.pinned ? '#92400e' : '#0b326a' }}>
                        {item.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button onClick={() => handleArchive(item)} style={{ ...actionBtnStyle, color: item.archived ? '#15803d' : '#647188' }}>
                        {item.archived ? 'Restore' : 'Archive'}
                      </button>
                      {!item.archived && (
                        <button onClick={() => togglePublish(item.id)} style={{ ...actionBtnStyle, color: item.published ? '#92400e' : '#15803d' }}>
                          {item.published ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      <button onClick={() => handleDelete(item)} style={{ ...actionBtnStyle, color: '#b91c1c' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNews.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#647188' }}>
                    No news found. Click "Add News" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* News form modal */}
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
            <h2 style={{ marginBottom: 0 }}>{editingId ? 'Edit News' : 'Create News'}</h2>
            <p className="modal-copy" style={{ marginTop: 8 }}>
              Fields marked with * are required.
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                Title *
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter news title" required />
              </label>

              <label>
                Category *
                <select
                  value={form.newsCategory}
                  onChange={(e) => setForm({ ...form, newsCategory: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 7, padding: 12, color: '#162d52', background: '#fff', border: '1px solid #cbd0d8', outlineColor: '#e0a12c' }}
                >
                  {NEWS_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Description *
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Enter the news description"
                  required
                  rows={4}
                  style={{ display: 'block', width: '100%', marginTop: 7, padding: 12, color: '#162d52', background: '#fff', border: '1px solid #cbd0d8', outlineColor: '#e0a12c', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </label>

              <label>
                News Photo
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <small style={{ display: 'block', marginTop: 6, color: '#647188' }}>Upload a JPG, PNG, WEBP, or other image up to 2 MB.</small>
              </label>
              {(() => {
                const selectedImage = getNewsImage({
                  id: editingId,
                  title: form.title,
                  imageUrl: form.imageUrl,
                  imageStorageKey: form.imageStorageKey,
                  imageAlt: form.imageAlt,
                })
                return selectedImage ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={selectedImage.src} alt={selectedImage.alt} style={{ width: '100%', height: 150, objectFit: 'cover', border: '1px solid #cbd0d8' }} />
                    {(form.imageUrl || form.imageStorageKey) && (
                      <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imageStorageKey: '', imageAlt: '' })} style={{ ...actionBtnStyle, marginTop: 8, color: '#b91c1c' }}>
                        Remove uploaded image
                      </button>
                    )}
                  </div>
                ) : null
              })()}

              <label>
                Date Posted *
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </label>

              <label>
                Author *
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="e.g. CICS Administration" required />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 400 }}>
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: 'auto', margin: 0 }} />
                Publish immediately
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 400 }}>
                <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} style={{ width: 'auto', margin: 0 }} />
                Pin as important news
              </label>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="primary" type="submit" style={{ flex: 1 }}>
                  {editingId ? 'Save Changes' : 'Publish News'} <Arrow />
                </button>
                <button type="button" onClick={closeForm} style={{ flex: 1, background: 'none', border: '1px solid #cbd0d8', color: '#647188', fontWeight: 600, fontSize: 13 }}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

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
