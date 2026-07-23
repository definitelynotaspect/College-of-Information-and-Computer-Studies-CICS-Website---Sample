import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'cics_content'

const DEFAULT_CONTENT = [
  {
    id: '1',
    title: 'CICS welcomes students for the new academic year',
    category: 'News',
    body: 'Stay updated with the latest college announcements, activities, and important information.',
    published: true,
    date: '2026-07-22',
  },
  {
    id: '2',
    title: 'PRELIMINARY EXAMINATION',
    category: 'Events',
    body: 'July 29 to August 01',
    published: true,
    date: '2026-07-29',
  },
  {
    id: '3',
    title: 'MIDTERM EXAMINATION',
    category: 'Events',
    body: 'September 09 to September 12',
    published: true,
    date: '2026-09-09',
  },
  {
    id: '4',
    title: 'SCHOOL INTRAMURALS',
    category: 'Events',
    body: 'September 22 to September 26',
    published: true,
    date: '2026-09-22',
  },
  {
    id: '5',
    title: 'FINAL EXAMINATION',
    category: 'Events',
    body: 'October 22 to October 24',
    published: true,
    date: '2026-10-22',
  },
  {
    id: '6',
    title: 'Dean\'s Message',
    category: 'Dean',
    body: 'Let us learn with purpose and use technology to create a positive impact.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '7',
    title: 'Welcome to CICS',
    category: 'Welcome',
    body: 'The College of Information and Computer Studies is committed to providing students with a meaningful learning environment, quality academic programs, and the skills needed for the digital world.',
    published: true,
    date: '2026-07-01',
  },
]

const ContentContext = createContext(null)

function loadContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    /* ignore */
  }
  return null
}

export function ContentProvider({ children }) {
  const [items, setItems] = useState(() => loadContent() || DEFAULT_CONTENT)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const getPublished = (category) => {
    return items.filter((i) => i.published && (!category || i.category === category))
  }

  const getAll = () => items

  const getById = (id) => items.find((i) => i.id === id)

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    }
    setItems((prev) => [newItem, ...prev])
    return newItem
  }

  const updateItem = (id, updates) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    )
  }

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const togglePublish = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, published: !i.published } : i))
    )
  }

  return (
    <ContentContext.Provider
      value={{
        items,
        getPublished,
        getAll,
        getById,
        addItem,
        updateItem,
        deleteItem,
        togglePublish,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}