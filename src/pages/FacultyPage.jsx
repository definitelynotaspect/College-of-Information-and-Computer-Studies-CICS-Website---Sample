import { useMemo, useState } from 'react'
import { loadFaculty } from '../utils/faculty'

export default function FacultyPage() {
  const [faculty] = useState(loadFaculty)
  const [query, setQuery] = useState('')
  const [expandedFacultyIds, setExpandedFacultyIds] = useState([])

  const filteredFaculty = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return faculty
    return faculty.filter((member) => (
      `${member.fullName} ${member.position} ${member.researchInterests}`
        .toLowerCase()
        .includes(normalizedQuery)
    ))
  }, [faculty, query])

  const detailList = (value) => value
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)

  const toggleProfile = (memberId) => {
    setExpandedFacultyIds((currentIds) => (
      currentIds.includes(memberId)
        ? currentIds.filter((id) => id !== memberId)
        : [...currentIds, memberId]
    ))
  }

  return (
    <main className="faculty-page">
      <section className="faculty-hero">
        <div className="container faculty-hero-grid">
          <div>
            <p className="kicker">FACULTY DIRECTORY</p>
            <h1>CICS Faculty Directory</h1>
            <p>
              Browse faculty profiles, contact details, consultation hours, research interests,
              educational background, and professional certifications.
            </p>
            <div className="faculty-toolbar">
              <label className="faculty-search">
                <span>Search faculty</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, position, or interest"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="container faculty-directory-section">
        <div className="faculty-section-head">
          <div>
            <p className="kicker">PERSONNEL</p>
            <h2>Faculty Profiles</h2>
          </div>
        </div>

        <div className="faculty-profile-list">
          {filteredFaculty.map((member) => {
            const isExpanded = expandedFacultyIds.includes(member.id)

            return (
              <article className="faculty-profile" key={member.id}>
                <img className="faculty-profile-photo" src={member.photo} alt={member.fullName} />
                <div className="faculty-profile-content">
                  <h3>{member.fullName}</h3>
                  <p className="faculty-profile-position">{member.position}</p>
                  <a className="faculty-profile-email" href={`mailto:${member.email}`}>{member.email}</a>
                  <button
                    className="faculty-profile-toggle"
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`${member.id}-profile`}
                    onClick={() => toggleProfile(member.id)}
                  >
                    <span className="faculty-profile-toggle-icon" aria-hidden="true" />
                    View Full Profile
                  </button>

                  {isExpanded && (
                    <div className="faculty-profile-details" id={`${member.id}-profile`}>
                      <section>
                        <h4>Educational Qualifications:</h4>
                        <ul>
                          {detailList(member.educationalBackground).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h4>Research Interests:</h4>
                        <ul>
                          {detailList(member.researchInterests).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h4>Office Hours:</h4>
                        <ul>
                          {detailList(member.officeHours).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h4>Professional Certifications:</h4>
                        <ul>
                          {detailList(member.certifications).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  )}
                </div>
            </article>
            )
          })}
        </div>

        {filteredFaculty.length === 0 && (
          <p className="faculty-empty">No faculty profiles match your search.</p>
        )}
      </section>
    </main>
  )
}
