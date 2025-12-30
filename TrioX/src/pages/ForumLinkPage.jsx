import { useEffect, useState } from 'react'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const parseGeminiJson = (raw = '') => {
  const cleaned = raw.replace(/^```json/gi, '').replace(/^```/gi, '').replace(/```$/g, '').trim()
  return JSON.parse(cleaned)
}

const generateTraceMatrix = (keyword) => [
  { label: 'Mirrors tracked', value: (120 + Math.floor(Math.random() * 10)).toString() },
  { label: 'Invites neutralized', value: (50 + Math.floor(Math.random() * 10)).toString() },
  { label: 'Live funnels', value: (8 + Math.floor(Math.random() * 5)).toString() },
  { label: 'Dormant assets', value: (30 + Math.floor(Math.random() * 10)).toString() }
]

const buildFallbackAlerts = (keyword) => [
  {
    site: `${keyword} hub`,
    label: 'Critical',
    messageCount: '8,000 msgs / 1h',
    topic: `${keyword} courier relaunch`,
    danger: `“${keyword} storm kits” pitch mirrors site closed 1 day ago — offline metro meetup.`,
    detectedAt: '2025-01-05 14:21 UTC',
    username: '@flakepilot'
  },
  {
    site: 'Torch Flower',
    label: 'High',
    messageCount: '3,420 msgs / 1h',
    topic: 'Ket microdose sampler',
    danger: 'Chem-lane cart reused; wallets preloaded for anon pickup.',
    detectedAt: '2025-01-05 13:50 UTC',
    username: 'anonymous courier'
  },
  {
    site: 'Nova Distro',
    label: 'High',
    messageCount: '2,110 msgs / 1h',
    topic: 'Logo beans presale',
    danger: 'Photo carousel from nova distro shop shut 24h ago.',
    detectedAt: '2025-01-05 13:05 UTC',
    username: '@novalabs'
  },
  {
    site: 'Midnight Courier',
    label: 'Medium',
    messageCount: '980 msgs / 1h',
    topic: 'Xylazine blend drop',
    danger: 'AI flagged “stronger than fent” copy + meet instructions.',
    detectedAt: '2025-01-05 12:36 UTC',
    username: 'anonymous'
  },
  {
    site: 'Ghostchain Lab',
    label: 'Medium',
    messageCount: '1,450 msgs / 1h',
    topic: 'Lab LSD sheets',
    danger: 'CTA gradient + typography cloned from Darklane archive.',
    detectedAt: '2025-01-05 11:58 UTC',
    username: '@spectrumdrop'
  }
]

const ForumLinkPage = () => {
  const [keyword, setKeyword] = useState('darklane')
  const [alerts, setAlerts] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [metrics, setMetrics] = useState(generateTraceMatrix('darklane'))

  const fetchGeminiAlerts = async (term) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Set VITE_GEMINI_API_KEY to enable AI forum crawl.')
    }

    const prompt = `
Return a JSON array of dark-web forum bursts referencing "${term}". Each object must include:
site, label (Critical/High/Medium/Low), messageCount (e.g., "8,000 msgs / 1h"), topic, danger, detectedAt, username.
`
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    )

    if (!response.ok) {
      throw new Error('Gemini forum scrape failed')
    }

    const payload = await response.json()
    const parts = payload?.candidates?.[0]?.content?.parts || []
    const text = parts.map((part) => part?.text || '').join('\n').trim()

    if (!text) {
      throw new Error('Gemini response empty')
    }

    const data = parseGeminiJson(text)
    return data.map((item, index) => ({
      site: item.site || `forum-${index}`,
      label: item.label || 'Medium',
      messageCount: item.messageCount || '0 msgs / 1h',
      topic: item.topic || 'Unknown topic',
      danger: item.danger || 'No detail provided',
      detectedAt: item.detectedAt || new Date().toISOString(),
      username: item.username || 'anonymous'
    }))
  }

  const runForumSearch = async (termInput) => {
    const term = termInput || 'darklane'
    setStatus('loading')
    setError(null)
    try {
      const data = await fetchGeminiAlerts(term)
      setAlerts(data)
      setMetrics(generateTraceMatrix(term))
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setAlerts(buildFallbackAlerts(term))
      setMetrics(generateTraceMatrix(term))
      setStatus('idle')
    }
  }

  useEffect(() => {
    runForumSearch('darklane')
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    runForumSearch(keyword.trim())
  }

  return (
    <>
      <section className="page-section">
        <header className="section-heading">
          <p>Forum scan</p>
          <h2>{status === 'loading' ? 'Scanning hidden threads…' : 'Legal forum shout-outs'}</h2>
          <span>Enter a keyword to synthesize dark forum burst data via Gemini.</span>
        </header>
        <form className="dark-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="darklane courier"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Scanning…' : 'Search'}
          </button>
        </form>
        {error && <div className="error-text">{error}</div>}
      </section>

      <section className="page-section">
        <header className="section-heading">
          <p>Link graph</p>
          <h2>Forum Discovery Network</h2>
          <span>
            Mapping referral hops, shorteners and dark marketing teams keeping the traffic alive.
          </span>
        </header>
        <div className="matrix-grid">
          {metrics.map((metric) => (
            <article className="matrix-card" key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <header className="section-heading">
          <p>Dark web forums</p>
          <h2>Danger form tracker (last hour)</h2>
          <span>
            Showing sample crawl proof tying topics to recently closed or re-skinned market sites.
          </span>
        </header>
        <div className="label-options">
          {['Critical', 'High', 'Medium', 'Low'].map((label) => (
            <span key={label} className={`label-pill ${label.toLowerCase()}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="alert-board">
          {alerts.map((alert) => (
            <article className="alert-card" key={`${alert.site}-${alert.topic}`}>
              <div className="alert-meta">
                <h3>{alert.site}</h3>
                <span className={`risk-label ${alert.label.toLowerCase()}`}>{alert.label}</span>
              </div>
              <span className="alert-count">{alert.messageCount}</span>
              <p className="alert-topic">Topic: {alert.topic}</p>
              <p className="alert-danger">{alert.danger}</p>
              <footer className="alert-footer">
                <span>{alert.detectedAt}</span>
                <span>{alert.username || 'anonymous user'}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ForumLinkPage
