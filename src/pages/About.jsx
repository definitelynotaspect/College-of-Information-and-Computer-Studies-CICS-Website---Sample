import { useContent } from '../context/ContentContext'

const fallback = {
  history: 'The College of Information and Computer Studies (CICS) prepares learners for a technology-driven world through relevant, accessible, and student-centered education. The college combines strong academic foundations with practical learning experiences that help students become capable and responsible digital professionals.',
  vision: 'A model performing learning institution where students receive flexible, accessible, and equitable education that develops literacy, critical thinking, creativity, and effective decision-making for lifelong learning.',
  mission: 'To nurture the wholesome development of every learner through efficient and effective programs, instruction, and meaningful learning experiences that build competence and productivity.',
  goals: [
    'Produce functionally literate and holistically developed learners.',
    'Promote academic advancement and technical-vocational skills through multimedia literacy.',
    "Develop higher-order thinking skills relevant to learners' needs.",
    'Inculcate love of country, national identity, and responsible citizenship.',
    'Strengthen ethical and spiritual values that uphold human dignity and respect.',
  ],
  coreValues: [
    { id: 'value-excellence', title: 'Excellence', body: 'We pursue high standards in instruction, research, innovation, and service while continuously improving the learning experience.' },
    { id: 'value-integrity', title: 'Integrity', body: 'We act with honesty, accountability, and respect in every academic and professional undertaking.' },
    { id: 'value-innovation', title: 'Innovation', body: 'We welcome creative ideas and practical technology solutions that respond to emerging needs.' },
    { id: 'value-inclusivity', title: 'Inclusivity', body: 'We build a welcoming environment where every learner is valued and given opportunities to succeed.' },
    { id: 'value-service', title: 'Service', body: 'We use our knowledge and skills to contribute meaningfully to students, communities, and society.' },
  ],
  recognitions: [
    { id: 'recognition-quality', title: 'Commitment to Quality Education', body: 'CICS is dedicated to delivering relevant, learner-centered programs in information and computer studies.' },
    { id: 'recognition-industry', title: 'Industry-Ready Learning', body: 'The college strengthens practical training through technology-based projects, hands-on activities, and career preparation.' },
    { id: 'recognition-community', title: 'Community Engagement', body: 'CICS supports technology literacy and community initiatives that make digital skills more accessible.' },
    { id: 'recognition-student', title: 'Student Achievement', body: 'The college celebrates learner accomplishments in academics, innovation, leadership, and service.' },
  ],
}

function ContentCards({ items, emptyText }) {
  if (!items.length) return <p className="about-empty">{emptyText}</p>

  return items.map((item) => (
    <article className="about-card" key={item.id}>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </article>
  ))
}

export default function About() {
  const { getPublished } = useContent()
  const history = getPublished('History')
  const vision = getPublished('Vision')
  const mission = getPublished('Mission')
  const goals = getPublished('Goals')
  const coreValues = getPublished('CoreValues')
  const organizationalCharts = getPublished('OrganizationalChart')
  const recognitions = getPublished('Recognitions')
  const organizationalChart = organizationalCharts[0]

  return (
    <main id="about" className="about-page">
      <section className="college-banner about-hero">
        <div className="container">
          <p className="kicker light">ABOUT THE COLLEGE</p>
          <h1>Know the people, purpose,<br /><em>and promise of CICS.</em></h1>
          <p>Discover the history, guiding principles, leadership structure, and achievements of the College of Information and Computer Studies.</p>
        </div>
      </section>

      <nav className="about-subnav" aria-label="About the College sections">
        <div className="container">
          <a href="#history">History</a><a href="#vision-mission">Vision &amp; Mission</a><a href="#goals">Goals</a><a href="#core-values">Core Values</a><a href="#organization">Organizational Chart</a><a href="#recognitions">Recognitions</a>
        </div>
      </nav>

      <section className="section about-history" id="history">
        <div className="container two-column">
          <div><p className="kicker">OUR HISTORY</p><h2>Built for the evolving digital world.</h2></div>
          <div className="about-prose">
            {history.length ? history.map((item) => <p key={item.id} className="lead">{item.body}</p>) : <p className="lead">{fallback.history}</p>}
          </div>
        </div>
      </section>

      <section className="vision-mission" id="vision-mission">
        <div className="container vm-grid">
          <article><p className="kicker">VISION</p><h2>{vision[0]?.body || fallback.vision}</h2></article>
          <article><p className="kicker">MISSION</p><h2>{mission[0]?.body || fallback.mission}</h2></article>
        </div>
      </section>

      <section className="section goals" id="goals">
        <div className="container two-column">
          <div><p className="kicker">COLLEGE GOALS</p><h3>In the realization of contemporary learning standards, ICF sets its contextualized goals and objectives grounded on human development and learner-centered curriculum:</h3></div>
          <ul>{(goals.length ? goals : fallback.goals.map((body, index) => ({ id: index, body }))).map((item) => <li key={item.id}>{item.body}</li>)}</ul>
        </div>
      </section>

      <section className="section core-values" id="core-values">
        <div className="container">
          <div className="about-section-heading"><p className="kicker">WHAT WE STAND FOR</p><h2>Core Values</h2><p>Our values guide how we learn, collaborate, and serve our community.</p></div>
          <div className="about-card-grid"><ContentCards items={coreValues.length ? coreValues : fallback.coreValues} emptyText="Core values will be published soon." /></div>
        </div>
      </section>

      <section className="section organization" id="organization">
        <div className="container">
          <div className="about-section-heading centered"><p className="kicker">COLLEGE LEADERSHIP</p><h2>Organizational Chart</h2><p>Our structure supports coordinated leadership, quality instruction, and student success.</p></div>
          <figure className="org-chart-frame">
            <img src={organizationalChart?.imageUrl || '/org%20chart.png'} alt={organizationalChart?.imageAlt || 'College of Information and Computer Studies organizational chart'} />
            <figcaption>{organizationalChart?.body || organizationalChart?.title || 'CICS Organizational Chart'}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section recognitions" id="recognitions">
        <div className="container">
          <div className="about-section-heading"><p className="kicker">ACHIEVEMENTS</p><h2>Recognitions</h2><p>Milestones that reflect the college's commitment to excellence, service, and industry relevance.</p></div>
          <div className="about-card-grid"><ContentCards items={recognitions.length ? recognitions : fallback.recognitions} emptyText="Recognitions will be published soon." /></div>
        </div>
      </section>
    </main>
  )
}
