import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import cicsLogo from '../assets/cics-logo.png'
import { saveCurriculumFile } from '../utils/curriculumFiles'

const emptyProgram = { name: '', degree: '', description: '', objectives: '', curriculum: '', careers: '', requirements: '', curriculumFile: null, curriculumUpload: null }
const PROGRAM_DRAFT_KEY = 'cics_dashboard_program_draft_v1'
const lines = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean)
const asLines = (value = []) => value.join('\n')

function loadProgramDraft() {
  try {
    const stored = localStorage.getItem(PROGRAM_DRAFT_KEY)
    return stored ? { ...emptyProgram, ...JSON.parse(stored), curriculumUpload: null } : emptyProgram
  } catch {
    return emptyProgram
  }
}

export default function ProgramsAdmin() {
  const { user, logout } = useAuth()
  const { programs, addProgram, updateProgram, deleteProgram, storageError } = useContent()
  const [form, setForm] = useState(loadProgramDraft)
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (editingId) return
    try {
      localStorage.setItem(PROGRAM_DRAFT_KEY, JSON.stringify({ ...form, curriculumFile: null, curriculumUpload: null }))
    } catch {
      /* ignore draft save errors */
    }
  }, [editingId, form])

  const showNotice = (message) => { setNotice(message); setTimeout(() => setNotice(''), 3500) }
  const clearForm = () => { setForm(emptyProgram); setEditingId(null); setOpen(false) }
  const closeForm = () => {
    if (editingId) {
      setForm(loadProgramDraft())
      setEditingId(null)
    }
    setOpen(false)
  }
  const editProgram = (program) => {
    setForm({ ...program, objectives: asLines(program.objectives), curriculum: asLines(program.curriculum), careers: asLines(program.careers), requirements: asLines(program.requirements), curriculumUpload: null })
    setEditingId(program.id)
    setOpen(true)
  }
  const uploadPdf = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) { showNotice('Please select a PDF file.'); event.target.value = ''; return }
    setForm((current) => ({ ...current, curriculumFile: { name: file.name, storageKey: editingId || null }, curriculumUpload: file }))
  }
  const submit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.degree.trim() || !form.description.trim()) { showNotice('Please complete the program name, degree, and description.'); return }
    const programId = editingId || Date.now().toString()
    let curriculumFile = form.curriculumFile
    if (form.curriculumUpload) {
      try {
        await saveCurriculumFile(programId, form.curriculumUpload)
        curriculumFile = { name: form.curriculumUpload.name, storageKey: programId }
      } catch {
        showNotice('The PDF could not be saved. Please check available browser storage and try again.')
        return
      }
    }
    const programFields = Object.fromEntries(Object.entries(form).filter(([key]) => key !== 'curriculumUpload'))
    const program = { ...programFields, id: programId, curriculumFile, objectives: lines(form.objectives), curriculum: lines(form.curriculum), careers: lines(form.careers), requirements: lines(form.requirements) }
    const saved = editingId ? await updateProgram(editingId, program) : await addProgram(program)
    if (!saved) { showNotice('Program was not saved. Use a smaller PDF or remove an older uploaded file, then try again.'); return }
    showNotice(editingId ? 'Program updated successfully.' : 'Program added successfully.')
    if (!editingId) localStorage.removeItem(PROGRAM_DRAFT_KEY)
    clearForm()
  }

  return (
    <div className="site-shell dashboard">
      <header className="dashboard-header"><div className="container"><div className="dash-brand"><img src={cicsLogo} alt="CICS seal" /><span><b>CICS Administration</b><small>Academic Programs Management</small></span></div><div className="account"><span>Welcome, {user?.displayName}</span><Link to="/programs">View Programs</Link><Link to="/dashboard">Content Dashboard</Link><button onClick={logout}>Log out</button></div></div></header>
      <main className="dashboard-main container">
        <p className="kicker">ADMINISTRATOR DASHBOARD</p>
        <div className="admin-heading"><div><h1>Academic Programs</h1><p className="dashboard-lead">Add, edit, or delete programs and upload a curriculum PDF for students to download.</p></div><button className="primary compact-button" onClick={() => { setEditingId(null); setOpen(true) }}>Add Program +</button></div>
        <div className="admin-program-list">
          {programs.map((program) => <article key={program.id}><div><p className="kicker">{program.degree}</p><h2>{program.name}</h2><p>{program.description}</p><small>{program.curriculumFile ? `Curriculum PDF: ${program.curriculumFile.name}` : 'No curriculum PDF uploaded'}</small></div><div className="admin-program-actions"><button onClick={() => editProgram(program)}>Edit</button><button className="delete-action" onClick={() => { if (window.confirm(`Delete ${program.name}?`)) { deleteProgram(program.id); showNotice('Program deleted.') } }}>Delete</button></div></article>)}
          {!programs.length && <p className="about-empty">No programs found. Add your first program to begin.</p>}
        </div>
      </main>
      {open && <div className="modal-backdrop" onClick={closeForm} role="presentation"><section className="auth-modal program-form" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true"><button className="close" onClick={closeForm} aria-label="Close">x</button><h2>{editingId ? 'Edit Program' : 'Add Program'}</h2><p className="modal-copy">Use one line for every objective, course, career opportunity, or requirement.</p><form onSubmit={submit}><label>Program Name *<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. BS Computer Science" required /></label><label>Degree Title *<input value={form.degree} onChange={(event) => setForm({ ...form, degree: event.target.value })} placeholder="e.g. Bachelor of Science in Computer Science" required /></label><label>Program Description *<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} required /></label><ProgramTextarea label="Objectives" field="objectives" form={form} setForm={setForm} /><ProgramTextarea label="Curriculum / Courses" field="curriculum" form={form} setForm={setForm} /><ProgramTextarea label="Career Opportunities" field="careers" form={form} setForm={setForm} /><ProgramTextarea label="Admission Requirements" field="requirements" form={form} setForm={setForm} /><label>Curriculum PDF<input type="file" accept="application/pdf,.pdf" onChange={uploadPdf} /><small style={{ display: 'block', marginTop: 6, color: '#647188' }}>Large PDF files are supported and stored separately from the program details.</small>{form.curriculumFile && <small className="file-status">Selected: {form.curriculumFile.name}</small>}</label><div className="program-form-actions"><button className="primary" type="submit">{editingId ? 'Save Changes' : 'Add Program'}</button><button type="button" onClick={closeForm}>Cancel</button></div></form></section></div>}
      {(notice || storageError) && <div className="toast" role="status">{notice || storageError}</div>}
    </div>
  )
}

function ProgramTextarea({ label, field, form, setForm }) {
  return <label>{label}<textarea value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} rows={3} placeholder="One item per line" /></label>
}
