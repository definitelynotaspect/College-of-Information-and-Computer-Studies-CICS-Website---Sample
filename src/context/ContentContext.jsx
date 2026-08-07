import { createContext, useContext, useState } from 'react'
import { saveCurriculumFile } from '../utils/curriculumFiles'

const STORAGE_KEY = 'cics_content'
const PROGRAMS_STORAGE_KEY = 'cics_programs'
const FEATURED_NEWS_RESTORE_KEY = 'cics_featured_news_restore_v1'
const CONTENT_DASHBOARD_MIGRATION_KEY = 'cics_content_dashboard_defaults_v1'
const COLLEGE_GOALS_MIGRATION_KEY = 'cics_college_goals_v1'

const DEFAULT_PROGRAMS = [
  {
    id: 'bs-computer-science',
    name: 'BS Computer Science',
    degree: 'Bachelor of Science in Computer Science',
    description: 'A four-year program that develops computing professionals with strong foundations in programming, algorithms, software development, and emerging technologies.',
    objectives: ['Build sound computing and problem-solving skills.', 'Develop software solutions using appropriate tools and technologies.', 'Practice ethical, collaborative, and lifelong learning habits.'],
    curriculum: ['Programming Fundamentals', 'Data Structures and Algorithms', 'Database Systems', 'Software Engineering', 'Artificial Intelligence'],
    careers: ['Software Developer', 'Systems Analyst', 'Data Analyst', 'Quality Assurance Engineer', 'IT Project Associate'],
    requirements: ['Completed application form', 'Senior High School report card or equivalent', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'Two recent ID photos'],
    curriculumFile: null,
  },
  {
    id: 'associate-computer-technology',
    name: 'Associate in Computer Technology',
    degree: 'Associate in Computer Technology',
    description: 'A two-year program focused on practical computer operations, programming, networking, and technical support skills for immediate entry into the technology workforce.',
    objectives: ['Apply computing concepts to workplace tasks.', 'Maintain and troubleshoot computer systems and networks.', 'Create simple technology solutions that respond to user needs.'],
    curriculum: ['Computer Fundamentals', 'Programming Concepts', 'PC Assembly and Maintenance', 'Networking Fundamentals', 'Web Development'],
    careers: ['Computer Technician', 'IT Support Staff', 'Junior Web Developer', 'Network Support Assistant', 'Data Encoder'],
    requirements: ['Completed application form', 'Senior High School report card or equivalent', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'Two recent ID photos'],
    curriculumFile: null,
  },
]

const DEFAULT_CONTENT = [
  {
    id: '1',
    title: 'CICS Welcomes Students for the New Academic Year',
    category: 'News',
    newsCategory: 'Announcement',
    body: 'CICS warmly welcomed new and returning students for Academic Year 2026-2027 through an orientation that introduced college programs, services, and the opportunities ahead.',
    published: true,
    date: '2026-06-22',
    author: 'CICS Administration',
    pinned: true,
    archived: false,
  },
  {
    id: '8',
    title: 'Oath-Taking Ceremony for the New CICS Officers',
    category: 'News',
    newsCategory: 'Event',
    body: 'The newly elected CICS student officers formally took their oath of office, pledging to lead with integrity and serve the college community throughout Academic Year 2026-2027.',
    published: true,
    date: '2026-07-22',
    author: 'CICS Student Council',
    pinned: false,
    archived: false,
  },
  {
    id: '9',
    title: 'CICS FEST 2026',
    category: 'News',
    newsCategory: 'Event',
    body: 'CICS FEST 2026 brings students, faculty, and guests together for technology exhibits, talent presentations, friendly competitions, and a celebration of CICS community spirit.',
    published: true,
    date: '2026-08-03',
    author: 'CICS Administration',
    pinned: true,
    archived: false,
  },
  {
    id: '10',
    title: 'CICS Showcases Student Innovation Projects',
    category: 'News',
    newsCategory: 'Achievement',
    body: 'CICS students present software, multimedia, and technology solutions in a project showcase that highlights creativity, collaboration, and practical problem-solving skills.',
    published: true,
    date: '2026-07-25',
    author: 'CICS Administration',
    pinned: false,
    archived: false,
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
  {
    id: '11',
    title: 'College History',
    category: 'History',
    body: 'The College of Information and Computer Studies (CICS) at Interworld Colleges Foundation, Inc. was established to meet the growing demand for skilled professionals in the field of information technology and computer science. Since its inception, CICS has been dedicated to providing quality education that combines theoretical knowledge with practical skills, preparing students for successful careers in the digital age.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '12',
    title: 'Excellence',
    category: 'CoreValues',
    body: 'We strive for the highest standards in academic instruction, research, and community service, fostering a culture of continuous improvement and innovation.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '21',
    title: 'College Vision',
    category: 'Vision',
    body: 'A model performing learning institution where students receive flexible, accessible, and equitable education that develops literacy, critical thinking, creativity, and effective decision-making for lifelong learning.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '22',
    title: 'College Mission',
    category: 'Mission',
    body: 'To nurture the wholesome development of every learner through efficient and effective programs, instruction, and meaningful learning experiences that build competence and productivity.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '23',
    title: 'Holistic Learners',
    category: 'Goals',
    body: 'Produce functionally literate and holistically developed learners;',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '24',
    title: 'Academic and Technical-Vocational Development',
    category: 'Goals',
    body: 'Provide general education programs that promote academic advancement and technical-vocational skills development via multi-media literacy content;',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '25',
    title: 'Higher-Order Thinking',
    category: 'Goals',
    body: "Facilitate the development of learners' higher-order thinking skills relevant to their needs;",
    published: true,
    date: '2026-07-01',
  },
  {
    id: '26',
    title: 'National Identity and Citizenship',
    category: 'Goals',
    body: 'Inculcate love of country that will promote national identity, obedience to the laws, and fulfillment of duties as Filipino citizens;',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '27',
    title: 'Ethical and Spiritual Values',
    category: 'Goals',
    body: 'Strengthen ethical and spiritual values necessary for moral character, human dignity, and respect for human rights.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '13',
    title: 'Integrity',
    category: 'CoreValues',
    body: 'We uphold honesty, transparency, and ethical conduct in all our endeavors, building trust and credibility within the academic community and beyond.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '14',
    title: 'Innovation',
    category: 'CoreValues',
    body: 'We embrace creativity and forward-thinking approaches to address emerging challenges and opportunities in the field of information and computer studies.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '15',
    title: 'Inclusivity',
    category: 'CoreValues',
    body: 'We foster a diverse and welcoming environment where every individual is valued, respected, and given equal opportunities to learn and grow.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '16',
    title: 'Service',
    category: 'CoreValues',
    body: 'We are committed to serving our students, community, and society through accessible education, outreach programs, and meaningful contributions to the field.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '17',
    title: 'CHED Recognition',
    category: 'Recognitions',
    body: 'CICS has been recognized by the Commission on Higher Education (CHED) for its exemplary performance in delivering quality programs in information technology and computer science.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '18',
    title: 'Academic Excellence Award',
    category: 'Recognitions',
    body: 'The college received the Academic Excellence Award for outstanding student performance and high passing rates in licensure and certification examinations.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '19',
    title: 'Community Service Recognition',
    category: 'Recognitions',
    body: 'CICS was honored for its active involvement in community development programs, technology literacy initiatives, and outreach projects that benefit local communities.',
    published: true,
    date: '2026-07-01',
  },
  {
    id: '20',
    title: 'Industry Partnership Award',
    category: 'Recognitions',
    body: 'The college was recognized for its strong industry partnerships that provide students with valuable internship opportunities, hands-on training, and career placement.',
    published: true,
    date: '2026-07-01',
  },
]

const FEATURED_NEWS_REFRESH = {
  '1': { previousTitles: ['CICS welcomes students for the new academic year', 'CICS Welcomes Students for the New Academic Year'], title: 'CICS Welcomes Students for the New Academic Year', body: 'CICS warmly welcomed new and returning students for Academic Year 2026-2027 through an orientation that introduced college programs, services, and the opportunities ahead.', date: '2026-08-04' },
  '8': { previousTitles: ['CICS launches student innovation hub', 'Oath-Taking Ceremony for the New CICS Officers'], title: 'Oath-Taking Ceremony for the New CICS Officers', body: 'The newly elected CICS student officers formally took their oath of office, pledging to lead with integrity and serve the college community throughout Academic Year 2026-2027.', date: '2026-08-01' },
  '9': { previousTitles: ['New digital labs opened for learners', 'CICS FEST 2026'], title: 'CICS FEST 2026', body: 'CICS FEST 2026 brings students, faculty, and guests together for technology exhibits, talent presentations, friendly competitions, and a celebration of CICS community spirit.', date: '2026-07-29' },
  '10': { previousTitles: ['CICS recognized for academic excellence', 'CICS Showcases Student Innovation Projects'], title: 'CICS Showcases Student Innovation Projects', body: 'CICS students present software, multimedia, and technology solutions in a project showcase that highlights creativity, collaboration, and practical problem-solving skills.', date: '2026-07-25' },
}

const ContentContext = createContext(null)

function loadContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const savedItems = JSON.parse(stored)
      if (!Array.isArray(savedItems)) return null

      const refreshedItems = savedItems
        .filter((item) => item && typeof item === 'object')
        .filter((item) => !['event-student-orientation', 'event-tech-seminar', 'event-coding-challenge', 'event-capstone-showcase'].includes(item.id))
        .map((item) => {
          const update = FEATURED_NEWS_REFRESH[item.id]
          return update && update.previousTitles.includes(item.title) ? { ...item, ...update } : item
        })

      let restoredItems = refreshedItems

      if (!localStorage.getItem(FEATURED_NEWS_RESTORE_KEY)) {
        localStorage.setItem(FEATURED_NEWS_RESTORE_KEY, 'true')
        const existingIds = new Set(refreshedItems.map((item) => item.id))
        const missingFeaturedNews = DEFAULT_CONTENT.filter((item) => ['8', '9', '10'].includes(item.id) && !existingIds.has(item.id))
        restoredItems = [...refreshedItems, ...missingFeaturedNews]
      }

      // Earlier versions saved only News and Events in localStorage. Add the
      // missing editable College records once, without replacing user content.
      if (!localStorage.getItem(CONTENT_DASHBOARD_MIGRATION_KEY)) {
        const existingIds = new Set(restoredItems.map((item) => item.id))
        const missingDefaultItems = DEFAULT_CONTENT.filter((item) => !existingIds.has(item.id))
        restoredItems = [...restoredItems, ...missingDefaultItems]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredItems))
        localStorage.setItem(CONTENT_DASHBOARD_MIGRATION_KEY, 'true')
      }

      // Replace the former two-item set with the complete College Goals list.
      if (!localStorage.getItem(COLLEGE_GOALS_MIGRATION_KEY)) {
        const goalDefaults = DEFAULT_CONTENT.filter((item) => item.category === 'Goals')
        const goalIds = new Set(goalDefaults.map((item) => item.id))
        restoredItems = [
          ...restoredItems.filter((item) => item.category !== 'Goals' || !goalIds.has(item.id)),
          ...goalDefaults,
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredItems))
        localStorage.setItem(COLLEGE_GOALS_MIGRATION_KEY, 'true')
      }

      return restoredItems
    }
  } catch {
    /* ignore */
  }
  return null
}

function loadPrograms() {
  try {
    const stored = localStorage.getItem(PROGRAMS_STORAGE_KEY)
    if (stored) {
      const savedItems = JSON.parse(stored)
      return savedItems.map((item) => {
        const update = FEATURED_NEWS_REFRESH[item.id]
        return update && update.previousTitles.includes(item.title) ? { ...item, ...update } : item
      })
    }
  } catch {
    /* ignore */
  }
  return null
}

export function ContentProvider({ children }) {
  const [items, setItems] = useState(() => loadContent() || DEFAULT_CONTENT)
  const [programs, setPrograms] = useState(() => loadPrograms() || DEFAULT_PROGRAMS)
  const [storageError, setStorageError] = useState('')

  const saveItems = (nextItems) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems))
      setItems(nextItems)
      setStorageError('')
      return true
    } catch {
      setStorageError('Changes could not be saved because browser storage is full. Remove an uploaded image or use a smaller image, then try again.')
      return false
    }
  }

  const savePrograms = async (nextPrograms) => {
    try {
      const programsForStorage = await Promise.all(nextPrograms.map(async (program) => {
        if (!program.curriculumFile?.data) return program
        const storageKey = `legacy-curriculum-${program.id}`
        await saveCurriculumFile(storageKey, program.curriculumFile.data)
        return { ...program, curriculumFile: { name: program.curriculumFile.name, storageKey } }
      }))
      localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programsForStorage))
      setPrograms(programsForStorage)
      setStorageError('')
      return true
    } catch {
      setStorageError('Changes could not be saved because browser storage is full.')
      return false
    }
  }

  const getPublished = (category) => {
    return items.filter((i) => i.published && (!category || i.category === category))
  }

  const getAll = () => items

  const getById = (id) => items.find((i) => i.id === id)

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      date: item.date || new Date().toISOString().split('T')[0],
    }
    return saveItems([newItem, ...items]) ? newItem : null
  }

  const updateItem = (id, updates) => {
    return saveItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteItem = (id) => {
    return saveItems(items.filter((item) => item.id !== id))
  }

const togglePublish = (id) => {
    return saveItems(items.map((item) => (item.id === id ? { ...item, published: !item.published } : item)))
  }

  const archiveItem = (id) => {
    return saveItems(items.map((item) => (item.id === id ? { ...item, archived: !item.archived } : item)))
  }

  const togglePin = (id) => {
    return saveItems(items.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)))
  }

  const addProgram = async (program) => {
    const newProgram = { ...program, id: program.id || Date.now().toString() }
    return savePrograms([...programs, newProgram])
  }

  const updateProgram = async (id, updates) => {
    return savePrograms(programs.map((program) => (program.id === id ? { ...program, ...updates } : program)))
  }

  const deleteProgram = async (id) => {
    return savePrograms(programs.filter((program) => program.id !== id))
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
        archiveItem,
        togglePin,
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        storageError,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

// Context hooks are intentionally exported with their provider component.
// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
