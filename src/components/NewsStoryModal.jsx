import { useEffect, useState } from 'react'
import { getNewsImage } from '../utils/newsImages'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const SHARE_CHANNELS = [
  { name: 'Facebook', color: '#1877f2', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { name: 'X / Twitter', color: '#000000', url: (u) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}` },
  { name: 'LinkedIn', color: '#0a66c2', url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
]

export default function NewsStoryModal({ story, onClose }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  if (!story) return null
  const image = getNewsImage(story)

  const shareUrl = (() => {
    try {
      return window.location.href
    } catch {
      return ''
    }
  })()

  const shareText = `Check out this news from CICS: ${story.title}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="news-story-backdrop" role="presentation" onClick={onClose}>
      <article
        className="news-story-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-story-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="news-story-close" type="button" onClick={onClose} aria-label="Close full story">
          ×
        </button>
        <div className="news-story-media">
          {image ? (
            <img src={image.src} alt={image.alt} />
          ) : (
            <div className="news-story-image-placeholder" role="img" aria-label="News image placeholder">
              Featured news
            </div>
          )}
        </div>
        <div className="news-story-content">
          <div className="news-story-topline">
            <p className="kicker">{story.newsCategory || 'FEATURED NEWS'}</p>
            {story.pinned && <span className="news-pinned-badge">📌 Important</span>}
          </div>
          {story.date && <p className="news-story-date">{formatDate(story.date)}</p>}
          <h2 id="news-story-title">{story.title}</h2>
          {story.author && <p className="news-story-author">By {story.author}</p>}
          <p className="news-story-body">{story.body}</p>

          <div className="news-story-share">
            <span className="news-share-label">Share this news</span>
            <div className="news-share-buttons">
              <button className="news-share-copy" type="button" onClick={copyLink}>
                {copied ? '✓ Link Copied' : 'Copy Link'}
              </button>
              {SHARE_CHANNELS.map((channel) => (
                <a
                  key={channel.name}
                  className="news-share-link"
                  style={{ background: channel.color }}
                  href={channel.url(shareUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${channel.name}`}
                >
                  {channel.name}
                </a>
              ))}
            </div>
          </div>

          <button className="news-story-done" type="button" onClick={onClose}>Close story</button>
        </div>
      </article>
    </div>
  )
}
