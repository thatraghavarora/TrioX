import { useEffect, useState } from 'react'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const parseGeminiJson = (raw = '') => {
  const cleaned = raw.replace(/^```json/gi, '').replace(/^```/gi, '').replace(/```$/g, '').trim()
  return JSON.parse(cleaned)
}

const buildFallbackRestartBursts = () => [
  { window: '00:00 - 04:00', count: 3, fingerprint: 'NovaStack', hash: '#a4f6' },
  { window: '04:00 - 08:00', count: 1, fingerprint: 'CrownSwitch', hash: '#93da' },
  { window: '08:00 - 12:00', count: 5, fingerprint: 'GhostRelay', hash: '#71cc' },
  { window: '12:00 - 16:00', count: 2, fingerprint: 'NovaStack', hash: '#a4f6' },
  { window: '16:00 - 20:00', count: 4, fingerprint: 'ColdBloom', hash: '#e5b4' },
  { window: '20:00 - 24:00', count: 6, fingerprint: 'GhostRelay', hash: '#71cc' }
]

const dnaFeatures = [
  'TLS handshake reuse',
  'Identical admin loader',
  'Wordmark pixel distribution',
  'Rotating affiliate parameters',
  'Banner gradient sampling',
  'Tracking beacon intervals'
]

const buildFallbackPatterns = (keyword) => ({
  keyword,
  sites: [
    {
      name: 'Darklane Hub',
      title: 'Darklane Hub – Overnight Chem Drops',
      started: '2023-08-12',
      closed: '2024-11-30',
      trust: 62,
      reusedContent: 'Matches “chem-delivery” layout on torchflower.onion',
      proof: 'CSS bundle frost.css re-used verbatim from hub archive captured 24h before takedown.'
    },
    {
      name: 'Torch Flower',
      title: 'Torch Flower Relief Store',
      started: '2024-02-03',
      closed: 'active',
      trust: 71,
      reusedContent: 'UI classes identical to darklane hub hero',
      proof: 'Hero block uses identical class `.hero__flare` + “chemist-landing” SVG.'
    },
    {
      name: 'Nova Distro',
      title: 'Nova Distro Wholesale',
      started: '2022-05-20',
      closed: '2023-12-10',
      trust: 44,
      reusedContent: 'Shared cart script + “frost” tag set',
      proof: 'Cart script `orderFlow.js` hashed same as torch flower build from 1 day earlier.'
    }
  ]
})

const buildFallbackGraph = () => [
  { label: 'Darklane clone', score: 82 },
  { label: 'Torch sibling', score: 68 },
  { label: 'Nova residue', score: 54 },
  { label: 'Glow mimic', score: 47 }
]

const PatternAnalysisPage = () => {
  const fallbackKeyword = 'darklane'
  const [keyword, setKeyword] = useState(fallbackKeyword)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [bursts, setBursts] = useState([])
  const [graph, setGraph] = useState([])
  const [patterns, setPatterns] = useState({ keyword: fallbackKeyword, sites: [] })

  const fetchGeminiPatterns = async (term) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Set VITE_GEMINI_API_KEY to enable AI pattern analysis.')
    }

    const prompt = `
Return a JSON object describing pattern analysis for the keyword "${term}".
{
  "bursts": [
    {"window": "00:00 - 04:00", "count": 3, "fingerprint": "...", "hash": "#a4f6"}
  ],
  "graph": [
    {"label": "Darklane clone", "score": 82}
  ],
  "sites": [
    {
      "name": "...",
      "title": "...",
      "started": "...",
      "closed": "...",
      "trust": 62,
      "reusedContent": "...",
      "proof": "..."
    }
  ]
}
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
      throw new Error('Gemini pattern request failed')
    }

    const payload = await response.json()
    const parts = payload?.candidates?.[0]?.content?.parts || []
    const text = parts.map((part) => part?.text || '').join('\n').trim()
    if (!text) {
      throw new Error('Gemini pattern response empty')
    }

    const data = parseGeminiJson(text)
    return {
      bursts: (data.bursts || []).map((entry, index) => ({
        window: entry.window || `win-${index}`,
        count: entry.count || 0,
        fingerprint: entry.fingerprint || 'Unknown Fingerprint',
        hash: entry.hash || '#0000'
      })),
      graph: (data.graph || []).map((entry, index) => ({
        label: entry.label || `pattern-${index}`,
        score: entry.score || 0
      })),
      sites: (data.sites || []).map((site, index) => ({
        name: site.name || `mirror-${index}`,
        title: site.title || 'Untitled Surface',
        started: site.started || 'Unknown',
        closed: site.closed || 'Active',
        trust: site.trust || 50,
        reusedContent: site.reusedContent || 'No reuse detail.',
        proof: site.proof || 'No proof supplied.'
      }))
    }
  }

  const runPatternSearch = async (termInput) => {
    const term = termInput || fallbackKeyword
    setStatus('loading')
    setError(null)

    try {
      const result = await fetchGeminiPatterns(term)
      setBursts(result.bursts.length ? result.bursts : buildFallbackRestartBursts())
      setGraph(result.graph.length ? result.graph : buildFallbackGraph())
      setPatterns({ keyword: term, sites: result.sites.length ? result.sites : buildFallbackPatterns(term).sites })
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setBursts(buildFallbackRestartBursts())
      setGraph(buildFallbackGraph())
      setPatterns(buildFallbackPatterns(term))
      setStatus('idle')
    }
  }

  useEffect(() => {
    runPatternSearch(fallbackKeyword)
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    runPatternSearch(keyword.trim())
  }

  const graphTotal = graph.reduce((sum, item) => sum + item.score, 0)

  return (
    <>
      <section className="page-section">
        <header className="section-heading">
          <p>Pattern memory</p>
          <h2>{status === 'loading' ? 'Analyzing relaunch bursts…' : 'Restart DNA Monitor'}</h2>
          <span>Enter a keyword to synthesize dark pattern intelligence.</span>
        </header>
        <form className="dark-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="darklane pattern"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Scanning…' : 'Search'}
          </button>
        </form>
        {error && <div className="error-text">{error}</div>}
        <div className="restart-grid">
          {bursts.map((burst) => (
            <article className="restart-card" key={burst.window}>
              <header>
                <h3>{burst.window}</h3>
                <span>{burst.hash}</span>
              </header>
              <p>{burst.fingerprint}</p>
              <strong>{burst.count} relaunches</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="dna-panel">
        <div className="section-heading">
          <p>Attributes</p>
          <h2>Website DNA Checklist</h2>
        </div>
        <ul>
          {dnaFeatures.map((feature) => (
            <li key={feature}>
              <span className="tick" />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-report">
        <header className="section-heading">
          <p>Dark web crawl (demo)</p>
          <h2>Pattern trace – {patterns.keyword}</h2>
          <span>Cross-checking mirrored onion markets for identical UI/UX and copy.</span>
        </header>
        <div className="pattern-graph">
          {graph.map((item) => {
            const percent = graphTotal ? Math.round((item.score / graphTotal) * 100) : 0
            return (
              <div className="pattern-graph-row" key={item.label}>
                <span>{item.label}</span>
                <div className="pattern-graph-bar">
                  <div style={{ width: `${percent}%` }}>
                    {item.score}% · {percent}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="surface-grid">
          {patterns.sites.map((site) => (
            <article className="surface-card" key={site.name}>
              <div className="surface-meta">
                <h3>{site.name}</h3>
                <span className="trust-score">{site.trust}% AI score</span>
              </div>
              <p className="surface-title">{site.title}</p>
              <dl>
                <div>
                  <dt>Start</dt>
                  <dd>{site.started}</dd>
                </div>
                <div>
                  <dt>Closed</dt>
                  <dd>{site.closed}</dd>
                </div>
              </dl>
              <div className="surface-tag">{site.reusedContent}</div>
              <p className="surface-proof">{site.proof}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default PatternAnalysisPage
