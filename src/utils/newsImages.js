import { useEffect, useState } from 'react'
import { getContentImageUrl } from './contentImages'

const imageFiles = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const NEWS_IMAGE_FILES_BY_ID = {
  '1': 'opening classes.jpg',
  '8': 'oath taking.jpg',
  '9': 'cics fest.png',
  '10': 'bulletin.jpg',
}

const NEWS_IMAGE_ALT = {
  'CICS Welcomes Students for the New Academic Year': 'Opening of classes announcement',
  'Oath-Taking Ceremony for the New CICS Officers': 'CICS officers during their oath-taking ceremony',
  'CICS FEST 2026': 'CICS FEST 2026 event poster',
  'CICS Showcases Student Innovation Projects': 'CICS student information bulletin board',
}

const NEWS_IMAGE_FILES_BY_TITLE = {
  'cics welcomes students for the new academic year': 'opening classes.jpg',
  'cics oath taking ceremony': 'oath taking.jpg',
  'oath-taking ceremony for the new cics officers': 'oath taking.jpg',
  'cics fest': 'cics fest.png',
  'cics fest 2026': 'cics fest.png',
  'cics new bulletin board': 'bulletin.jpg',
  'cics showcases student innovation projects': 'bulletin.jpg',
}

export function getNewsImage(itemOrTitle, id) {
  const item = itemOrTitle && typeof itemOrTitle === 'object' ? itemOrTitle : { title: itemOrTitle || '', id }
  if (item.imageUrl) {
    return { src: item.imageUrl, alt: item.imageAlt || item.title || 'News image' }
  }

  const filename = NEWS_IMAGE_FILES_BY_ID[item.id]
    || NEWS_IMAGE_FILES_BY_TITLE[(item.title || '').trim().toLowerCase()]
  if (!filename) return null

  return {
    src: imageFiles[`../assets/${filename}`],
    alt: item.imageAlt || NEWS_IMAGE_ALT[item.title] || item.title,
  }
}

export function useNewsImage(item) {
  const [storedImage, setStoredImage] = useState(null)
  const storageKey = item?.imageStorageKey
  const fallbackImage = getNewsImage(item)

  useEffect(() => {
    let active = true
    let objectUrl = null

    if (storageKey) {
      getContentImageUrl(storageKey)
        .then((src) => {
          if (!active || !src) return
          objectUrl = src
          setStoredImage({ key: storageKey, src })
        })
        .catch(() => {})
    }

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [storageKey])

  if (storedImage?.key === storageKey) {
    return { src: storedImage.src, alt: item?.imageAlt || item?.title || 'Content image' }
  }
  return fallbackImage
}
