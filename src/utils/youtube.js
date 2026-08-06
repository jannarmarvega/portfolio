const ID = '[\\w-]{11}'

const PATTERNS = [
  new RegExp(`youtu\\.be/(${ID})`),
  new RegExp(`youtube(?:-nocookie)?\\.com/(?:watch\\?(?:[^"'\\s]*&)?v=|embed/|shorts/|live/|v/)(${ID})`),
  new RegExp(`^(${ID})$`),
]

// "90", "1m30s", "1h2m3s" -> seconds
function toSeconds(raw) {
  if (!raw) return 0
  if (/^\d+$/.test(raw)) return Number(raw)
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!match) return 0
  const [, h, m, s] = match
  return Number(h || 0) * 3600 + Number(m || 0) * 60 + Number(s || 0)
}

/**
 * Pull a YouTube video ID out of whatever the user pasted: a full `<iframe>`
 * embed snippet, a watch/share/shorts/embed URL, or a bare 11-character ID.
 *
 * Only the ID is ever used — pasted markup is never rendered as HTML, so a
 * hostile snippet cannot inject scripts or point the player at another origin.
 *
 * @returns {{ id: string, start: number } | null}
 */
export function parseYouTube(input) {
  if (typeof input !== 'string') return null

  let text = input.trim()
  if (!text) return null

  // If it's an iframe snippet, narrow to the src URL before matching.
  const iframeSrc = text.match(/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i)
  if (iframeSrc) text = iframeSrc[1]

  let id = null
  for (const pattern of PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      id = match[1]
      break
    }
  }
  if (!id) return null

  const start = text.match(/[?&](?:start|t)=([\dhms]+)/i)
  return { id, start: toSeconds(start?.[1]) }
}

export function youtubeThumbnail(id, quality = 'maxresdefault') {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export function youtubeEmbedUrl(id, { start = 0, autoplay = true } = {}) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  if (autoplay) params.set('autoplay', '1')
  if (start > 0) params.set('start', String(start))
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}
