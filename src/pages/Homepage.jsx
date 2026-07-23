import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import deanBeverly from '../assets/images/dean-beverly.png'
import cicsLogo from '../assets/images/cics-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>

export default function Homepage() {
  const { getPublished } = useContent()
  const [notice, setNotice] = useState('')

  const showNotice = (text) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 3500)
  }

  const newsItems = getPublished('News')
  const events = getPublished('Events')
  const deanMsg = getPublished('Dean')
  const welcomeMsg = getPublished('Welcome')

  return (
    <main id="home">
      {/* College Banner */}
      <section className="college-banner">
        <div className="container banner-grid">
          <div>
            <p className="kicker light">INTERWORLD COLLEGES FOUNDATION, INC.</p>
            <h1>
              College of Information
              <br />
              <em>and Computer Studies</em>
            </h1>
            <p>Empowering learners through information, innovation, and computer studies.</p>
          </div>
          <div className="seal-display">
            <div className="ring">
              <img src={cicsLogo} alt="CICS official seal" />
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="welcome section" id="welcome">
        <div className="container two-column">
          <div>
            <p className="kicker">WELCOME MESSAGE</p>
            <h2>Welcome to CICS</h2>
          </div>
          <div>
            {welcomeMsg.length > 0 ? (
              welcomeMsg.map((item) => (
                <p key={item.id} className="lead">{item.body}</p>
              ))
            ) : (
              <>
                <p className="lead">
                  The College of Information and Computer Studies is committed to providing students
                  with a meaningful learning environment, quality academic programs, and the skills
                  needed for the digital world.
                </p>
                <p>We support our students as they learn, create, and grow into responsible technology professionals.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission">
        <div className="container vm-grid">
          <article>
            <p className="kicker">VISION</p>
            <h2>
              A model of performing formal learning institution where students are provided with
              flexible, accessible, and equitable education resulting to a higher level of literacy,
              development of critical thinking, creative thinking, and effective decision-making
              skills as prerequisites for lifelong learning.
            </h2>
          </article>
          <article>
            <p className="kicker">MISSION</p>
            <h2>
              ICF is committed to the wholesome development of every learner who is expected to
              demonstrate exemplary competence and productivity by providing an efficient and
              effective administration of its programs and instructions.
            </h2>
          </article>
        </div>
      </section>

      {/* Goals and Objectives */}
      <section className="section goals" id="goals">
        <div className="container two-column">
          <div>
            <p className="kicker">GOALS AND OBJECTIVES</p>
            <h3>
              In the realization of contemporary learning standards, ICF sets its contextualized
              goals and objectives grounded on human development and learner-centered curriculum:
            </h3>
          </div>
          <ul>
            <li>Produce functionally literate and holistically developed learners;</li>
            <li>
              Provide general education programs that promote academic advancement and
              technical-vocational skills development via multi-media literacy content;
            </li>
            <li>Facilitate the development of learners' higher-order thinking skills relevant to their needs;</li>
            <li>
              Inculcate love of country that will promote national identity, obedience to the laws,
              and fulfillment of duties as Filipino citizens;
            </li>
            <li>Strengthen ethical and spiritual values necessary for moral character, human dignity, and respect for human rights.</li>
          </ul>
        </div>
      </section>

      {/* Dean's Message */}
      <section className="dean-message">
        <div className="container dean-grid">
          <div className="dean-portrait">
            <div className="dean-portrait-frame">
              <img src={deanBeverly} alt="College Dean" />
            </div>
            <span className="dean-portrait-label">CICS</span>
          </div>
          <div>
            <p className="kicker light">DEAN'S MESSAGE</p>
            {deanMsg.length > 0 ? (
              <>
                <h2>&ldquo;{deanMsg[0].body}&rdquo;</h2>
                <p>Welcome to the CICS community. Together, we will continue to pursue knowledge, excellence, and service.</p>
              </>
            ) : (
              <>
                <h2>&ldquo;Let us learn with purpose and use technology to create a positive impact.&rdquo;</h2>
                <p>Welcome to the CICS community. Together, we will continue to pursue knowledge, excellence, and service.</p>
              </>
            )}
            <b>Mrs. Beverly B. Pascua, MIT</b>
            <span className="dean-title">College Dean</span>
          </div>
        </div>
      </section>

      {/* Featured News & Events */}
      <section className="section information" id="information">
        <div className="container info-grid">
          <div>
            <p className="kicker">FEATURED NEWS</p>
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <article className="featured" key={item.id} style={{ marginBottom: 16 }}>
                  <p className="date">COLLEGE ANNOUNCEMENT</p>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                  <button onClick={() => showNotice('Featured news will be posted here by the administrator.')}>
                    Read more <Arrow />
                  </button>
                </article>
              ))
            ) : (
              <article className="featured">
                <p className="date">COLLEGE ANNOUNCEMENT</p>
                <h2>CICS welcomes students for the new academic year</h2>
                <p>Stay updated with the latest college announcements, activities, and important information.</p>
                <button onClick={() => showNotice('Featured news will be posted here by the administrator.')}>
                  Read more <Arrow />
                </button>
              </article>
            )}
          </div>
          <div>
            <p className="kicker">UPCOMING EVENTS</p>
            <div className="events">
              {events.length > 0 ? (
                events.map((item, idx) => (
                  <article key={item.id}>
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <p>{item.body}</p>
                      <h3>{item.title}</h3>
                    </div>
                  </article>
                ))
              ) : (
                <>
                  <article>
                    <span>01</span>
                    <div>
                      <p>July 29 to August 01</p>
                      <h3>PRELIMINARY EXAMINATION</h3>
                    </div>
                  </article>
                  <article>
                    <span>02</span>
                    <div>
                      <p>September 09 to September 12</p>
                      <h3>MIDTERM EXAMINATION</h3>
                    </div>
                  </article>
                  <article>
                    <span>03</span>
                    <div>
                      <p>September 22 to September 26</p>
                      <h3>SCHOOL INTRAMURALS</h3>
                    </div>
                  </article>
                  <article>
                    <span>04</span>
                    <div>
                      <p>October 22 to October 24</p>
                      <h3>FINAL EXAMINATION</h3>
                    </div>
                  </article>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <div className="container">
          <p className="kicker light">QUICK LINKS</p>
          <div>
            {['Admissions', 'Academic Programs', 'Student Resources', 'Contact the College'].map((link) => (
              <button key={link} onClick={() => showNotice(`${link} information will be added by the administrator.`)}>
                {link} <Arrow />
              </button>
            ))}
          </div>
        </div>
      </section>

      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  )
}