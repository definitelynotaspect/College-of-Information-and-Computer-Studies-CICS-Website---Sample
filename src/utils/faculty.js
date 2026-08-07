const STORAGE_KEY = 'cics_faculty_directory'

export const defaultFaculty = [
  {
    id: 'beverly-beltran-pascua',
    photo: '/faculty/beverly-beltran-pascua.jpg',
    fullName: 'Beverly Beltran-Pascua',
    position: 'CICS Dean',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'College leadership, computing education, academic program development.',
    email: 'beverly.beltran-pascua@cics.edu.ph',
    officeHours: 'Monday to Friday, by appointment',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'jeron-rafael-magbalot',
    photo: '/faculty/jeron-rafael-magbalot.jpg',
    fullName: 'Jeron Rafael B. Magbalot',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Programming fundamentals, web development, student systems.',
    email: 'jeron.magbalot@cics.edu.ph',
    officeHours: 'Monday and Wednesday, 1:00 PM - 3:00 PM',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'aianey-constantino-suing',
    photo: '/faculty/aianey-constantino-suing.jpg',
    fullName: 'Aianey Constantino-Suing',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Human-computer interaction, information systems, digital learning.',
    email: 'aianey.suing@cics.edu.ph',
    officeHours: 'Tuesday and Thursday, 10:00 AM - 12:00 PM',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'jerald-publico',
    photo: '/faculty/jerald-publico.jpg',
    fullName: 'Jerald Publico',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Software engineering, mobile applications, database systems.',
    email: 'jerald.publico@cics.edu.ph',
    officeHours: 'Wednesday, 9:00 AM - 11:00 AM',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'christian-alavazo',
    photo: '/faculty/christian-alavazo.jpg',
    fullName: 'Christian Alavazo',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Networking, cybersecurity, systems administration.',
    email: 'christian.alavazo@cics.edu.ph',
    officeHours: 'Friday, 1:00 PM - 4:00 PM',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'mhar-joseph-ondes',
    photo: '/faculty/mhar-joseph-ondes.jpg',
    fullName: 'Mhar Joseph B. Ondes',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Computer hardware, technical support, network maintenance.',
    email: 'mhar.ondes@cics.edu.ph',
    officeHours: 'Tuesday, 1:00 PM - 3:00 PM',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'kimberly-quinez',
    photo: '/faculty/kimberly-quinez.jpg',
    fullName: 'Kimberly A. Quinez',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Data management, educational technology, information literacy.',
    email: 'kimberly.quinez@cics.edu.ph',
    officeHours: 'Monday, 10:00 AM - 12:00 PM',
    certifications: 'To be updated by the administrator.',
  },
  {
    id: 'kristofer-dela-cruz',
    photo: '/faculty/kristofer-dela-cruz.jpg',
    fullName: 'Kristofer Van T. Dela Cruz',
    position: 'CICS Teacher',
    educationalBackground: 'To be updated by the administrator.',
    researchInterests: 'Web systems, UI development, software project documentation.',
    email: 'kristofer.delacruz@cics.edu.ph',
    officeHours: 'Thursday, 1:00 PM - 3:00 PM',
    certifications: 'To be updated by the administrator.',
  },
]

export const emptyFaculty = {
  photo: '',
  fullName: '',
  position: '',
  educationalBackground: '',
  researchInterests: '',
  email: '',
  officeHours: '',
  certifications: '',
}

export function loadFaculty() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultFaculty
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) && parsed.length ? parsed : defaultFaculty
  } catch {
    return defaultFaculty
  }
}

export function saveFaculty(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
