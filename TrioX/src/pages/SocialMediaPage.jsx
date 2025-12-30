import { useState, useEffect } from 'react'
import SocialMediaPanel from '../components/SocialMediaPanel'

const stats = [
  { label: 'Hidden Sites Live', value: '08', hint: 'watch window 24h' },
  { label: 'Alerts Today', value: '37', hint: 'matched slang + payload' },
  { label: 'Recycled Patterns', value: '5', hint: 'fingerprinted restarts' }
]

const serviceCards = [
  {
    title: 'Social Pulse Monitor',
    description:
      'Scanning IG, X, Telegram & soon for rapid spikes and slang like "snow" or "party favors".',
    uptime: 'Live 48h',
    channels: ['IG', 'X', 'Soon']
  },
  {
    title: 'Story Scrape Lens',
    description:
      'Extracts story overlays for burner QR, emojis and co-ordinates that hint at meet locations.',
    uptime: 'Live 19h',
    channels: ['Stories', 'Reels']
  },
  {
    title: 'Whisper Detection',
    description:
      'Vectorizes encrypted-channel exports to surface repeated drip campaigns inside comment threads.',
    uptime: 'Stable 33h',
    channels: ['TG Drops', 'X Lists']
  },
  {
    title: 'Influencer Risk',
    description:
      'Ranks handles amplifying deals while blending with lifestyle pivots to avoid platform heuristics.',
    uptime: 'Memory 76h',
    channels: ['Watch Tier']
  }
]

const lexicon = [
  { code: 'snow', meaning: 'cocaine' },
  { code: 'beans', meaning: 'pills' },
  { code: 'glow', meaning: 'LSD' },
  { code: 'skies', meaning: 'ketamine' }
]

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const parseGeminiJson = (raw = '') => {
  const cleaned = raw.replace(/^```json/gi, '').replace(/^```/gi, '').replace(/```$/g, '').trim()
  return JSON.parse(cleaned)
}

const generateDemoPosts = (keyword) => {
  const now = Date.now()
  const basePosts = [
    {
      channel: 'NightPulse Stories',
      members: '48.1k',
      message: `IG reel hyping “${keyword} drip” drop after midnight with frost emojis.`,
      offsetMinutes: 2
    },
    {
      channel: 'GhostCartel Thread',
      members: '12.3k',
      message: `Reddit AMA about sourcing ${keyword} kits via burner couriers.`,
      offsetMinutes: 7
    },
    {
      channel: 'Pulse Tracker',
      members: '89.7k',
      message: `Telegram poll asking followers if the new ${keyword} slang “flare” is compromised.`,
      offsetMinutes: 14
    },
    {
      channel: 'Metro Drop Watch',
      members: '6.6k',
      message: `Facebook group gossip about ${keyword} code words tied to metro meetups.`,
      offsetMinutes: 22
    },
    {
      channel: 'Echo Lounge',
      members: '15.4k',
      message: `Matrix invite referencing ${keyword} courier path reused from last weekend.`,
      offsetMinutes: 31
    },
    {
      channel: 'Spectrum Lens',
      members: '9.8k',
      message: `X list tracking influencers teasing ${keyword} bundles in recycled stories.`,
      offsetMinutes: 43
    }
  ]

  return basePosts.map((post, index) => {
    const postedDate = new Date(now - post.offsetMinutes * 60 * 1000)
    return {
      id: `demo-${index}`,
      channel: post.channel,
      members: post.members,
      postedAt: postedDate.toISOString(),
      lifespan: 'Live',
      message: post.message
    }
  })
}

const generateDummyFeeds = (keyword) => [
  {
    id: 'ig-01',
    platform: 'Instagram',
    handle: '@nightfloats',
    snippet: `Reel tease: “micro ${keyword} kits drop after midnight – ping 🔑 word frostbite to unlock courier.”`,
    posted: 'IG · 32m ago'
  },
  {
    id: 'reddit-02',
    platform: 'Reddit',
    handle: 'r/medmixers',
    snippet: `Thread bragging about pressing “mint beans” with ${keyword} logos.`,
    posted: 'Reddit · 2h ago'
  },
  {
    id: 'fb-03',
    platform: 'Facebook',
    handle: 'Darklane Market',
    snippet: `Live video teaser for “${keyword} storm care package” shipping from Mumbai with stealth cosmetics.`,
    posted: 'Facebook · 1h ago'
  },
  {
    id: 'x-04',
    platform: 'X',
    handle: '@spectrumflare',
    snippet: `Thread warning: “${keyword} courier back online tonight, same QR art as seized channel yesterday.”`,
    posted: 'X · 47m ago'
  }
]

const generateTrafficHistory = (keyword) => [
  { label: `${keyword} courier`, hits: 55 + Math.floor(Math.random() * 15) },
  { label: 'frostbite', hits: 45 + Math.floor(Math.random() * 10) },
  { label: 'beanshell', hits: 34 + Math.floor(Math.random() * 10) },
  { label: 'glow-wire', hits: 28 + Math.floor(Math.random() * 10) },
  { label: 'metro drop', hits: 20 + Math.floor(Math.random() * 8) }
]

const buildFallbackData = (keyword) => ({
  posts: generateDemoPosts(keyword),
  feeds: generateDummyFeeds(keyword),
  traffic: generateTrafficHistory(keyword)
})

const buildMetaLine = (post) => {
  const parts = []
  if (post.members) parts.push(post.members)
  if (post.lifespan) parts.push(post.lifespan)
  if (post.channelHandle) parts.push(post.channelHandle)
  if (!parts.length && post.views) parts.push(`${post.views} views`)
  return parts.join(' · ') || 'Global search surface'
}

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return null
  const then = new Date(timestamp)
  const now = new Date()
  const diff = Math.max(0, now.getTime() - then.getTime())
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const buildFooterStat = (post) => {
  if (post.views) {
    return `${post.views} views`
  }
  if (post.forwards) {
    return `${post.forwards} forwards`
  }
  if (post.postedAt) {
    return formatRelativeTime(post.postedAt)
  }
  if (post.posted) {
    return post.posted
  }
  return 'via backend scraper'
}

const SocialMediaPage = () => {
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [feeds, setFeeds] = useState([])
  const [traffic, setTraffic] = useState([])
  const trafficTotal = traffic.reduce((sum, entry) => sum + entry.hits, 0)

  const fetchGeminiData = async (keyword) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Set VITE_GEMINI_API_KEY to enable AI search.')
    }

    const prompt = `
Return a JSON object describing social-media monitoring for the keyword "${keyword}" with this shape:
{
  "posts": [
    {"id": "...", "channel": "...", "members": "...", "postedAt": "ISO", "message": "..."}
  ],
  "feeds": [
    {"id": "...", "platform": "Instagram", "handle": "@user", "snippet": "...", "posted": "IG · 32m ago"}
  ],
  "traffic": [
    {"label": "...", "hits": 40}
  ]
}
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    )

    if (!response.ok) {
      throw new Error('Gemini request failed')
    }

    const payload = await response.json()
    const parts = payload?.candidates?.[0]?.content?.parts || []
    const text = parts.map((part) => part?.text || '').join('\n').trim()
    if (!text) {
      throw new Error('Gemini response empty')
    }

    const parsed = parseGeminiJson(text)
    const normalizedPosts = (parsed.posts || []).map((item, index) => ({
      id: item.id || `gemini-${index}`,
      channel: item.channel || 'Unknown Surface',
      members: item.members || 'n/a',
      postedAt: item.postedAt || new Date().toISOString(),
      message: item.message || 'No summary provided.',
      lifespan: item.lifespan || 'Live',
      permalink: item.permalink || null,
      views: item.views || null,
      forwards: item.forwards || null
    }))

    const normalizedFeeds = (parsed.feeds || []).map((item, index) => ({
      id: item.id || `feed-${index}`,
      platform: item.platform || 'Unknown',
      handle: item.handle || '@unknown',
      snippet: item.snippet || 'No snippet.',
      posted: item.posted || 'just now'
    }))

    const normalizedTraffic = (parsed.traffic || []).map((item) => ({
      label: item.label || 'unknown',
      hits: Number(item.hits) || 0
    }))

    return {
      posts: normalizedPosts,
      feeds: normalizedFeeds.length ? normalizedFeeds : generateDummyFeeds(keyword),
      traffic: normalizedTraffic.length ? normalizedTraffic : generateTrafficHistory(keyword)
    }
  }

  const runSearch = async (keyword) => {
    const normalized = keyword || 'drugs'
    setStatus('loading')
    setError(null)
    setActiveQuery(normalized)
    try {
      const aiData = await fetchGeminiData(normalized)
      setPosts(aiData.posts)
      setFeeds(aiData.feeds)
      setTraffic(aiData.traffic)
      setStatus('done')
    } catch (err) {
      setError(err.message)
      const fallbackData = buildFallbackData(normalized)
      setPosts(fallbackData.posts)
      setFeeds(fallbackData.feeds)
      setTraffic(fallbackData.traffic)
      setStatus('done')
    }
  }

  useEffect(() => {
    runSearch('drugs')
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    const keyword = query.trim() || 'drugs'
    runSearch(keyword)
  }

  return (
    <>
      <SocialMediaPanel />

      <section className="telegram-scraper">
        <div className="section-heading">
          <p>Telegram Scrab</p>
          <h2>{status === 'loading' ? 'Loading…' : 'Keyword Search Pipeline'}</h2>
          <span>
            Queries fan out to backend collectors, only returning public channel or chat posts that
            contain your hidden term.
          </span>
        </div>

        <form className="telegram-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="telegram-input"
            placeholder="Search Telegram for code words: snow, beans, glow..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="search-button" disabled={status === 'loading'}>
            {status === 'loading' ? 'Scanning…' : 'Scrape Channels'}
          </button>
        </form>

        <div className="search-status">
          {status === 'idle' && <span>Ready to synthesize social chatter for your keyword.</span>}
          {status === 'loading' && <span>Generating Gemini intelligence…</span>}
          {status === 'done' && (
            <span>
              Showing {posts.length} hit(s) for <strong>{activeQuery}</strong>
            </span>
          )}
        </div>

        {error && <div className="error-text">{error}</div>}

        {activeQuery && (
          <div className="query-pill">
            Matched keyword: <strong>{activeQuery}</strong>
          </div>
        )}

        <div className="telegram-feed">
          {posts.map((post) => (
            <article className="telegram-card" key={post.id}>
              <header>
                <div>
                  <h3>{post.channel}</h3>
                  <p>{buildMetaLine(post)}</p>
                </div>
                <span className="posted">
                  {post.postedAt ? formatRelativeTime(post.postedAt) : post.posted}
                </span>
              </header>
              <p className="message">{post.message}</p>
              <footer>
                <span className="keyword-pill subtle">{activeQuery}</span>
                <span>{buildFooterStat(post)}</span>
                {post.permalink && (
                  <a href={post.permalink} target="_blank" rel="noreferrer">
                    Open drop
                  </a>
                )}
              </footer>
            </article>
          ))}
          {status === 'done' && posts.length === 0 && (
            <div className="telegram-empty">
              No Telegram drops with <strong>{activeQuery}</strong>. Try another code word.
            </div>
          )}
        </div>
      </section>

      <section className="social-digest">
        <header className="section-heading">
          <p>Multi-network sweep</p>
          <h2>Synthetic Mentions</h2>
          <span>AI generated chatter referencing “{activeQuery || 'your keyword'}” on IG, Reddit, Facebook, and X.</span>
        </header>
        <div className="digest-grid">
          {feeds.map((item) => (
            <article className="digest-card" key={item.id}>
              <div className="digest-meta">
                <span className="platform-tag">{item.platform}</span>
                <span className="handle">{item.handle}</span>
              </div>
              <p>{item.snippet}</p>
              <footer>{item.posted}</footer>
            </article>
          ))}
        </div>
      </section>

      <section className="traffic-panel">
        <header className="section-heading">
          <p>Search result traffic</p>
          <h2>Keyword pulse</h2>
          <span>Real-time share of slang tied to “{activeQuery || 'your keyword'}”.</span>
        </header>
        <div className="traffic-bars">
          {traffic.map((entry) => {
            const percent = trafficTotal ? Math.round((entry.hits / trafficTotal) * 100) : 0
            return (
              <div className="traffic-row" key={entry.label}>
                <span className="traffic-label">{entry.label}</span>
                <div className="traffic-bar">
                  <div
                    className="traffic-fill"
                    style={{ width: `${percent}%` }}
                    aria-label={`${percent}% share`}
                  >
                    <span>
                      {entry.hits} · {percent}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>


    </>
  )
}

export default SocialMediaPage
