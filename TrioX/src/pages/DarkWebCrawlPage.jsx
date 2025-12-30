import { useEffect, useState } from 'react'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const hoverDetails = [
  {
    brief: 'Darklane Hub · frost.css cloned',
    reusedContent: 'Matches “chem-delivery” layout on torchflower.onion',
    proof: 'CSS bundle frost.css re-used verbatim from hub archive captured 24h before takedown.'
  },
  {
    brief: 'Torch Flower · hero flare reused',
    reusedContent: 'Hero block uses identical class `.hero__flare` + “chemist-landing” SVG',
    proof: 'Screenshot from 1 day earlier shows same hero markup + gradient tokens.'
  },
  {
    brief: 'Nova Distro · orderFlow.js identical',
    reusedContent: 'Shared cart script + “frost” tag set',
    proof: 'orderFlow.js hash sha256:c0ffee matches torch flower build from 24h prior.'
  },
  {
    brief: 'Glow Market · chem-cart UI copy',
    reusedContent: 'Checkout tag `chem-cart` + identical CTA button',
    proof: 'Glow CTA uses same `.btn--flare` class + snowflake icon set.'
  },
  {
    brief: 'Midnight Courier · snow courier CTA',
    reusedContent: 'Landing CTA copy identical to Darklane Hub “Snow courier” pitch',
    proof: 'Archived darklane_hub_2024.html shows same text + courier icon.'
  },
  {
    brief: 'Ghostchain Lab · banner gradient',
    reusedContent: 'Hero gradient tokens match Darklane design system',
    proof: 'Design token gradient_ice reused across both sites.'
  },
  {
    brief: 'Silent Market · pallet icon set',
    reusedContent: 'Icon sprite `pallet.svg` reused from Nova Distro',
    proof: 'Both sprites share same checksum, captured 1 day before Nova shutdown.'
  }
]

const quickMatches = hoverDetails.map((detail) => detail.brief)

const buildFallbackSurfaces = (keyword) => [
  {
    name: `${keyword} hub`,
    link: `http://example-${keyword}.onion`,
    title: 'Overnight Chem Drops',
    description: `Mirror advertises “${keyword} courier” relaunch with identical hero layout.`,
    uptime: 'Live 1h 12m',
    aiScore: 74,
    special: 'Fingerprint frost.css + dead-drop emoji cipher'
  },
  {
    name: 'torch flower',
    link: 'http://torchflowerdemo.onion',
    title: 'Relief Store X v3',
    description: 'Every CTA uses .hero__flare class from seized build; same contact bot.',
    uptime: 'Live 3h 07m',
    aiScore: 81,
    special: 'Burner bot handshake + gradient DNA'
  },
  {
    name: 'ghostchain lab',
    link: 'http://ghostchainmock.onion',
    title: 'Lab Sheets + LSD',
    description: 'Hero gradient tokens and tracking beacons match Darklane archive.',
    uptime: 'Back 42m',
    aiScore: 65,
    special: 'Beacon cadence every 33s, not seen on clearnet'
  },
  {
    name: 'nova distro',
    link: 'http://novadistromirror.onion',
    title: 'Wholesale Logo Beans',
    description: 'Carousel replays marketing shots from shop closed 24h ago.',
    uptime: 'Dormant 19h',
    aiScore: 52,
    special: 'Cart script hash orderFlow.js ✓'
  },
  {
    name: 'midnight courier',
    link: 'http://midnightcourier.onion',
    title: 'Xylazine Blend Drop',
    description: 'AI flagged “stronger than fent” copy + meet instructions.',
    uptime: 'Live 55m',
    aiScore: 69,
    special: 'Meta field contains NFC tag recipe'
  }
]

const DarkWebCrawlPage = () => {
  const [keyword, setKeyword] = useState('darklane')
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [surfaces, setSurfaces] = useState([])

  const fetchGeminiSurfaces = async (term) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Set VITE_GEMINI_API_KEY to enable AI crawl.')
    }

    const prompt = `
Return a JSON array of fictional dark web mirrors related to "${term}". Each item must include:
name, link (onion URL), title, description, uptime, aiScore (number), special (string describing unique dark web-only trait).
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
      throw new Error('Gemini crawl failed')
    }

    const payload = await response.json()
    const parts = payload?.candidates?.[0]?.content?.parts || []
    const text = parts.map((part) => part?.text || '').join('\n').trim()
    if (!text) {
      throw new Error('Gemini crawl returned empty response')
    }

    const data = JSON.parse(text.replace(/^```json/gi, '').replace(/^```/gi, '').replace(/```$/g, ''))
    return data.map((item, index) => ({
      name: item.name || `mirror-${index}`,
      link: item.link || 'http://example.onion',
      title: item.title || 'Untitled Market',
      description: item.description || 'No description provided.',
      uptime: item.uptime || 'Live',
      aiScore: item.aiScore || 50,
      special: item.special || 'Hidden marker not on clearnet'
    }))
  }

  const runCrawl = async (termInput) => {
    const term = termInput || 'darklane'
    setStatus('loading')
    setError(null)
    try {
      const result = await fetchGeminiSurfaces(term)
      setSurfaces(result)
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setSurfaces(buildFallbackSurfaces(term))
      setStatus('idle')
    }
  }

  useEffect(() => {
    runCrawl('darklane')
  }, [])

  const handleCrawl = async (event) => {
    event.preventDefault()
    runCrawl(keyword.trim())
  }

  return (
    <>
      <section className="dark-search">
        <div className="section-heading">
          <p>Surface discovery</p>
          <h2>{status === 'loading' ? 'Crawling hidden mirrors…' : 'Search mirrors & indices'}</h2>
          <span>Enter onion keywords or paste a URL – this demo bar is static for hackathon view.</span>
        </div>
        <form
          className="dark-search-form"
          onSubmit={handleCrawl}
        >
          <input
            type="text"
            placeholder="darklane chem delivery"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Crawling…' : 'Run crawl'}
          </button>
        </form>
        <ul className="match-list">
          {quickMatches.map((match, index) => (
            <li
              key={match}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {match}
              {hoveredIndex === index && (
                <div className="match-tooltip">
                  <p>{hoverDetails[index].reusedContent}</p>
                  <p>{hoverDetails[index].proof}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="dark-search-hint">
          Example queries: torch flower, nova distro, snow courier, chem bundle.
        </p>
        {error && <div className="error-text">{error}</div>}
      </section>

      <section className="onion-catalog">
        <header className="section-heading">
          <p>Dark web surfaces</p>
          <h2>Pattern fingerprinted markets</h2>
          <span>Dummy list of onion mirrors that reuse layouts, scripts, or hidden markers.</span>
        </header>
        <div className="onion-grid">
          {surfaces.map((site) => (
            <article className="onion-card" key={site.name}>
              <div className="onion-head">
                <div>
                  <h3>{site.name}</h3>
                  <a href={site.link} target="_blank" rel="noreferrer">
                    {site.link.replace(/^https?:\/\//, '')}
                  </a>
                </div>
                <span className="trust-score">{site.aiScore}% AI score</span>
              </div>
              <p className="onion-title">{site.title}</p>
              <p className="onion-desc">{site.description}</p>
              <div className="onion-extra">
                <span>{site.uptime}</span>
                <span>{site.special}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default DarkWebCrawlPage
