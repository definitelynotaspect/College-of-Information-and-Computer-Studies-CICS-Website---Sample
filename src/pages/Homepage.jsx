import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { Link } from 'react-router-dom'
import NewsStoryModal from '../components/NewsStoryModal'
import deanBeverly from '../assets/dean-beverly.png'
import cicsLogo from '../assets/cics-logo.png'
import { getNewsImage } from '../utils/newsImages'

const Arrow = () => <span aria-hidden="true">→</span>

function HomepageNewsImage({ item, index }) {
  const image = getNewsImage(item)
  return (
    <div className={`homepage-news-image image-${(index % 4) + 1}`}>
      {image && <img src={image.src} alt={image.alt} />}
      <span className="news-image-label">FEATURED NEWS</span>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getMonthAbbr(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

function getDay(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.getDate()
}

function sortByNewestDate(a, b) {
  return new Date(b.date || 0) - new Date(a.date || 0)
}

export default function Homepage() {
  const { getPublished } = useContent()
  const [selectedStory, setSelectedStory] = useState(null)

  const newsItems = getPublished('News')
  const events = [...getPublished('Events')].sort((a, b) => new Date(a.date) - new Date(b.date))
  const deanMsg = getPublished('Dean')
  const welcomeMsg = getPublished('Welcome')
  const featuredNews = [...newsItems].sort(sortByNewestDate)

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

      {/* About */}
      <section className="welcome section" id="about">
        <div className="container welcome-panel">
          <div className="welcome-heading">
            <p className="kicker">WELCOME MESSAGE</p>
            <h2>Welcome to CICS</h2>
            <div className="welcome-mark" aria-hidden="true">CICS</div>
          </div>
          <div className="welcome-copy">
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
            <div className="welcome-pillars" aria-label="CICS learning values">
              <span>Learn</span>
              <span>Create</span>
              <span>Lead</span>
            </div>
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

      {/* Latest News */}
      <section className="section latest-news">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="kicker">FEATURED NEWS</p>
              <h2>Featured announcements from CICS</h2>
            </div>
            <Link to="/news#news" className="homepage-more-news">
              More News <Arrow />
            </Link>
          </div>
          <div className="homepage-news-grid">
            {(featuredNews.length > 0 ? featuredNews.slice(0, 4) : [
              {
                id: 'placeholder-1',
                title: 'CICS Welcomes Students for the New Academic Year',
                body: 'CICS warmly welcomed new and returning students for Academic Year 2026-2027 through an orientation that introduced college programs, services, and the opportunities ahead.',
                date: '2026-08-04',
              },
              {
                id: 'placeholder-2',
                title: 'Oath-Taking Ceremony for the New CICS Officers',
                body: 'The newly elected CICS student officers formally took their oath of office, pledging to lead with integrity and serve the college community throughout Academic Year 2026-2027.',
                date: '2026-08-01',
              },
              {
                id: 'placeholder-3',
                title: 'CICS FEST 2026',
                body: 'CICS FEST 2026 brings students, faculty, and guests together for technology exhibits, talent presentations, friendly competitions, and a celebration of CICS community spirit.',
                date: '2026-07-29',
              },
              {
                id: 'placeholder-4',
                title: 'CICS Showcases Student Innovation Projects',
                body: 'CICS students present software, multimedia, and technology solutions in a project showcase that highlights creativity, collaboration, and practical problem-solving skills.',
                date: '2026-07-25',
              },
            ]).map((item, idx) => (
              <article className="homepage-news-card" key={item.id}>
                <HomepageNewsImage item={item} index={idx} />
                <div className="homepage-news-content">
                  <p className="homepage-news-date">{formatDate(item.date)}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
                <button className="homepage-news-button" type="button" onClick={() => setSelectedStory(item)}>
                  Read more
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedStory && <NewsStoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />}

      {/* Upcoming Events */}
      <section className="section upcoming-events" id="news-events">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="kicker">UPCOMING EVENTS</p>
              <h2>Don’t miss the next college activities</h2>
            </div>
            <Link to="/news#events" className="homepage-more-news">
              More Events <Arrow />
            </Link>
          </div>
          <div className="homepage-events-grid">
              {events.length > 0 ? (
                events.map((item) => (
                  <article key={item.id} className="event-card">
                    <div className="event-date-box">
                      <span className="event-month">{getMonthAbbr(item.date)}</span>
                      <span className="event-day">{getDay(item.date)}</span>
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">{item.title}</h4>
                      <p className="event-desc">{item.body}</p>
                    </div>
                  </article>
                ))
              ) : (
                <>
                  <article className="event-card">
                    <div className="event-date-box">
                      <span className="event-month">JUL</span>
                      <span className="event-day">29</span>
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">PRELIMINARY EXAMINATION</h4>
                      <p className="event-desc">July 29 to August 01</p>
                    </div>
                  </article>
                  <article className="event-card">
                    <div className="event-date-box">
                      <span className="event-month">SEP</span>
                      <span className="event-day">09</span>
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">MIDTERM EXAMINATION</h4>
                      <p className="event-desc">September 09 to September 12</p>
                    </div>
                  </article>
                  <article className="event-card">
                    <div className="event-date-box">
                      <span className="event-month">SEP</span>
                      <span className="event-day">22</span>
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">SCHOOL INTRAMURALS</h4>
                      <p className="event-desc">September 22 to September 26</p>
                    </div>
                  </article>
                  <article className="event-card">
                    <div className="event-date-box">
                      <span className="event-month">OCT</span>
                      <span className="event-day">22</span>
                    </div>
                    <div className="event-info">
                      <h4 className="event-title">FINAL EXAMINATION</h4>
                      <p className="event-desc">October 22 to October 24</p>
                    </div>
                  </article>
                </>
              )}
            </div>
          </div>

      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <div className="container">
          <p className="kicker light">QUICK LINKS</p>
          <div>
            <Link to="/about">About CICS <Arrow /></Link>
            <Link to="/programs">Academic Programs <Arrow /></Link>
            <Link to="/news">News &amp; Events <Arrow /></Link>
            <a href="#footer">Contact CICS <Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  )
}
