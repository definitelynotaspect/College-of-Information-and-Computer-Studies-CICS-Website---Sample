import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { getNewsImage } from '../utils/newsImages'
import NewsStoryModal from '../components/NewsStoryModal'

const NEWS_CATEGORY_LABELS = {
  Announcement: '#1e40af',
  Event: '#92400e',
  Achievement: '#166534',
  Scholarship: '#5b21b6',
  General: '#0369a1',
}

function NewsImage({ item }) {
  const image = getNewsImage(item)
  return image ? (
    <img className="news-image" src={image.src} alt={image.alt} />
  ) : (
    <div className="news-image-placeholder" role="img" aria-label="Image placeholder">
      <span>IMAGE PLACEHOLDER</span>
      <small>Add photo later</small>
    </div>
  )
}

const Arrow = () => <span aria-hidden="true">→</span>

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

function NewsCard({ item, onOpen }) {
  const categoryColor = NEWS_CATEGORY_LABELS[item.newsCategory] || '#0369a1'
  return (
    <article className="news-card">
      <NewsImage item={item} />
      <div className="news-card-top">
        <span className="news-category" style={{ color: categoryColor, background: `${categoryColor}14` }}>
          {item.newsCategory || 'General'}
        </span>
        <span className="news-date-badge">{formatDate(item.date)}</span>
      </div>
      {item.pinned && (
        <span className="news-pinned-badge" aria-label="Important news">📌 Important</span>
      )}
      <h3 className="news-card-title">{item.title}</h3>
      <p className="news-card-body">{item.body}</p>
      <div className="news-card-meta">
        {item.author && <span className="news-author">By {item.author}</span>}
      </div>
      <button className="news-read-more" type="button" onClick={() => onOpen(item)}>
        Read full story <Arrow />
      </button>
    </article>
  )
}

function NewsSection({ items, onOpen }) {
  return (
    <div className="news-grid">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  )
}

export default function NewsAndEvents() {
  const { hash } = useLocation()
  const { getPublished } = useContent()
  const [selectedStory, setSelectedStory] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const allNews = [...getPublished('News')]
    .filter((item) => !item.archived)
    .sort(sortByNewestDate)
  const events = [...getPublished('Events')].sort((a, b) => new Date(a.date) - new Date(b.date))

  const pinnedNews = allNews.filter((item) => item.pinned)
  const regularNews = allNews.filter((item) => !item.pinned)

  const normalizedSearch = search.trim().toLowerCase()
  const filterNews = (list) =>
    list.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        (item.body || '').toLowerCase().includes(normalizedSearch) ||
        (item.author || '').toLowerCase().includes(normalizedSearch) ||
        (item.newsCategory || '').toLowerCase().includes(normalizedSearch)
      const matchesCategory =
        categoryFilter === 'All' || (item.newsCategory || 'General') === categoryFilter
      return matchesSearch && matchesCategory
    })

  const visiblePinned = filterNews(pinnedNews)
  const visibleRegular = filterNews(regularNews)

  const categories = ['All', ...new Set(allNews.map((item) => item.newsCategory || 'General'))]

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [hash])

  return (
    <main id="news-and-events">
      {/* Page header */}
      <section className="college-banner news-page-hero">
        <div className="container news-page-hero-content">
          <div>
            <p className="kicker light">NEWS AND ANNOUNCEMENTS</p>
            <h1>
              College News
              <br />
              <em>and Announcements</em>
            </h1>
          </div>
          <p className="news-page-hero-copy">
            Explore announcements, student milestones, and the activities that bring the CICS community together.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section news-toolbar-section">
        <div className="container">
          <div className="news-toolbar">
            <div className="news-search">
              <label className="kicker" htmlFor="news-search">Search News</label>
              <input
                id="news-search"
                type="search"
                placeholder="Search by title, category, or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="news-category-filter">
              <span className="kicker">Filter by Category</span>
              <div className="news-filter-chips">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={categoryFilter === cat ? 'active' : ''}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important / Pinned News */}
      {visiblePinned.length > 0 && (
        <section className="section news-section important-news-section" id="news">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="kicker">IMPORTANT NEWS</p>
                <h2>Pinned Announcements</h2>
              </div>
              <p className="section-subtitle">
                Important updates highlighted by the CICS administration.
              </p>
            </div>
            <NewsSection items={visiblePinned} onOpen={setSelectedStory} />
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="section news-section" id="news">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="kicker">LATEST NEWS</p>
              <h2>Featured News &amp; Announcements</h2>
            </div>
            <p className="section-subtitle">
              Stay informed with the latest updates, announcements, and stories from the College of
              Information and Computer Studies.
            </p>
          </div>

          {visibleRegular.length > 0 ? (
            <NewsSection items={visibleRegular} onOpen={setSelectedStory} />
          ) : (
            <p className="news-empty">
              {search || categoryFilter !== 'All'
                ? 'No news matches your search. Try a different keyword or category.'
                : 'No news posted yet. Check back soon for the latest announcements.'}
            </p>
          )}
        </div>
      </section>

      {selectedStory && <NewsStoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />}

      {/* Upcoming Events Section */}
      <section className="section events-section" id="events">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="kicker">UPCOMING EVENTS</p>
              <h2>Events Calendar</h2>
            </div>
            <p className="section-subtitle">
              Mark your calendars for important academic dates, school activities, and college events.
            </p>
          </div>

          <div className="events-grid">
            {events.length > 0 ? (
              events.map((item) => (
                <article key={item.id} className="event-card">
                  <div className="event-date-box">
                    <span className="event-month">{getMonthAbbr(item.date)}</span>
                    <span className="event-day">{getDay(item.date)}</span>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">{item.title}</h3>
                    <p className="event-desc">{item.body}</p>
                    <span className="event-dot"></span>
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
                    <h3 className="event-title">PRELIMINARY EXAMINATION</h3>
                    <p className="event-desc">July 29 to August 01</p>
                    <span className="event-dot"></span>
                  </div>
                </article>
                <article className="event-card">
                  <div className="event-date-box">
                    <span className="event-month">SEP</span>
                    <span className="event-day">09</span>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">MIDTERM EXAMINATION</h3>
                    <p className="event-desc">September 09 to September 12</p>
                    <span className="event-dot"></span>
                  </div>
                </article>
                <article className="event-card">
                  <div className="event-date-box">
                    <span className="event-month">SEP</span>
                    <span className="event-day">22</span>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">SCHOOL INTRAMURALS</h3>
                    <p className="event-desc">September 22 to September 26</p>
                    <span className="event-dot"></span>
                  </div>
                </article>
                <article className="event-card">
                  <div className="event-date-box">
                    <span className="event-month">OCT</span>
                    <span className="event-day">22</span>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">FINAL EXAMINATION</h3>
                    <p className="event-desc">October 22 to October 24</p>
                    <span className="event-dot"></span>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links back to home */}
      <section className="quick-links">
        <div className="container">
          <p className="kicker light">STAY CONNECTED</p>
          <div>
            <a href="/" className="nav-link" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Back to Home <Arrow />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
