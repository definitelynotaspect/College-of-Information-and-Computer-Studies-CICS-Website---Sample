import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import { Link } from 'react-router-dom'
import cicsLogo from '../assets/images/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { items, addItem, updateItem, deleteItem, togglePublish } = useContent()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ title: '', category: 'News', body: '', published: true })
  const [filter, setFilter] = useState('All')

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  const resetForm = () => {
    setForm({ title: '', category: 'News', body: '', published: true })
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (item) => {
    setForm({ title: item.title, category: item.category, body: item.body, published: item.published })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      showNotice('Please fill in all required fields.')
      return
    }
    if (editingId) {
      updateItem(editingId, form)
      showNotice('Content updated successfully.')
    } else {
      addItem(form)
      showNotice('Content added successfully.')
    }
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id)
      showNotice('Content deleted.')
    }
  }

  const isSuperAdmin = user?.role === 'Super Administrator'
  const isEditor = user?.role === 'College Dean' || isSuperAdmin

  const filteredItems = filter === 'All' ? items : items.filter((i) => i.category === filter)
  const categories = ['All', ...new Set(items.map((i) => i.category))]

  if (!isEditor) {
    return (
      <div className="site-shell">
        <header className="dashboard-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="dash-brand">
              <img src={cicsLogo} alt="CICS seal" />
              <span>
                <b>CICS Administration</b>
                <small>Homepage Management</small>
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
              <small>Homepage Management</small>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Content Management</h1>
            <p className="dashboard-lead">
              Manage News, Events, and Dean's Message content displayed on the homepage.
            </p>
          </div>
          <button className="primary" style={{ width: 'auto', padding: '13px 24px' }} onClick={() => { resetForm(); setShowForm(true) }}>
            Add New Content <Arrow />
          </button>
        </div>

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
              {cat}
            </button>
          ))}
        </div>

        {/* Content Form Modal */}
        {showForm && (
          <div className="modal-backdrop" role="presentation" onClick={resetForm}>
            <section
              className="auth-modal"
              role="dialog"
              aria-modal="true"
              style={{ width: 'min(100%, 560px)', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close" onClick={resetForm} aria-label="Close">×</button>
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
                    <option value="News">News</option>
                    <option value="Events">Events</option>
                    <option value="Dean">Dean's Message</option>
                    <option value="Welcome">Welcome</option>
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
                    onClick={resetForm}
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
                      {item.category}
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
                        onClick={() => togglePublish(item.id)}
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

      {notice && <div className="toast" role="status">{notice}</div>}
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