import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { getCurriculumFileUrl } from '../utils/curriculumFiles'

function DetailList({ title, items }) {
  return (
    <section className="program-detail">
      <h3>{title}</h3>
      <ul>{items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}</ul>
    </section>
  )
}

export default function Programs() {
  const { programs } = useContent()
  const [curriculumUrls, setCurriculumUrls] = useState({})

  useEffect(() => {
    let active = true
    const objectUrls = []
    
    Promise.all(programs.map(async (program) => {
      try {
        const url = await getCurriculumFileUrl(program.curriculumFile)
        if (url?.startsWith('blob:')) objectUrls.push(url)
        return [program.id, url]
      } catch {
        return [program.id, null]
      }
    })).then((entries) => {
      if (active) setCurriculumUrls(Object.fromEntries(entries))
    })

    return () => {
      active = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [programs])

  return (
    <main className="programs-page">
      <section className="college-banner programs-hero">
        <div className="container">
          <p className="kicker light">ACADEMIC PROGRAMS</p>
          <h1>Start building your<br /><em>future in technology.</em></h1>
          <p>Explore undergraduate programs designed to build relevant knowledge, practical skills, and career confidence.</p>
        </div>
      </section>

      <section className="section programs-section">
        <div className="container">
          <div className="about-section-heading"><p className="kicker">UNDERGRADUATE PROGRAMS</p><h2>Choose your learning path.</h2><p>Each program combines a strong academic foundation with skills that meet the needs of an evolving technology industry.</p></div>
          <div className="programs-list">
            {programs.map((program, index) => (
              <article className="program-card" key={program.id}>
                <header className="program-card-header"><span>0{index + 1}</span><div><p>{program.degree}</p><h2>{program.name}</h2></div></header>
                <div className="program-description"><h3>Program Description</h3><p>{program.description}</p></div>
                <div className="program-detail-grid">
                  <DetailList title="Objectives" items={program.objectives} />
                  <DetailList title="Career Opportunities" items={program.careers} />
                  <DetailList title="Curriculum" items={program.curriculum} />
                  <DetailList title="Admission Requirements" items={program.requirements} />
                </div>
                <footer className="program-actions">
                  {curriculumUrls[program.id] ? <a href={curriculumUrls[program.id]} download={program.curriculumFile.name} className="program-download">Download Curriculum PDF</a> : program.curriculumFile ? <span className="curriculum-note">Preparing curriculum PDF…</span> : <span className="curriculum-note">Curriculum PDF can be uploaded by the administrator.</span>}
                </footer>
              </article>
            ))}
            {!programs.length && <p className="about-empty">No academic programs have been published yet.</p>}
          </div>
        </div>
      </section>
    </main>
  )
}
