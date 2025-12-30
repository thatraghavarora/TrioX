const IntroPage = () => {
  const highlights = [
    'TrioX Shield is a real API-driven monitoring system designed for lawful analysis of public and accessible data.',
    'The platform unifies social media, forums, and mirror-site intelligence into a single operational dashboard.',
    'Every signal is logged, timestamped, and packaged to support review, reporting, and evidence workflows.',
    'Built using Web2 architecture so real data connectors can be integrated without changing the UI schema.'
  ]

  const focusAreas = [
    {
      title: '1) Risk Detection & Proof Generation',
      points: [
        'Automated scanning of public content using API-based collectors.',
        'Structured risk indicators highlight content that may require further review.',
        'Each alert is accompanied by supporting metadata to explain why it was flagged.',
        'Designed to assist human analysts, not replace decision-making.'
      ]
    },
    {
      title: '2) Dark Web Activity Monitoring',
      points: [
        'Continuous tracking of onion and mirror websites for availability changes.',
        'Logs when sites open, close, or reappear under new domains.',
        'Historical snapshots allow analysts to review activity over time.',
        'Supports comparison of newly discovered sites against previous records.'
      ]
    },
    {
      title: '3) Public Forum & Social Pulse',
      points: [
        'Monitors public forums and social platforms via approved APIs and data feeds.',
        'Detects unusual posting spikes, repeated campaigns, and coordinated behavior.',
        'Summarizes discussions into readable intelligence briefs for faster triage.'
      ]
    },
    {
      title: '4) Pattern & Relaunch Analysis',
      points: [
        'Compares site layouts, structures, and content patterns across time.',
        'Identifies likely duplicate or relaunch sites using similarity analysis.',
        'Builds timelines to show how frequently platforms shut down and resurface.',
        'Helps investigators understand long-term operational behavior.'
      ]
    }
  ]

  return (
    <section className="info-page">
      <header className="section-heading">
        <p>Team TrioX</p>
        <h2>TrioX Shield — API-Based Intelligence Platform</h2>
        <span>
          A real-world Web2 application designed to help analysts monitor public digital spaces,
          track patterns, and generate review-ready intelligence using lawful data sources.
        </span>
      </header>

      <article className="info-card">
        <h3>Problem Statement</h3>
        <p>
          Online platforms, forums, and mirror websites evolve rapidly, making it difficult for
          investigative and compliance teams to maintain visibility. TrioX Shield addresses this
          challenge by aggregating publicly accessible data into a single, structured system
          that supports monitoring, analysis, and documentation.
        </p>
        <ul>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="info-card">
        <h3>How the System Works</h3>
        <p>
          TrioX Shield operates through a modular, API-first backend. Each connector collects
          public or authorized data from a specific source. The data is normalized, logged,
          and analyzed to surface meaningful patterns, trends, and anomalies.
        </p>
        <p className="info-note">
          The system focuses on transparency and traceability: every output can be reviewed,
          validated, and exported for reporting or legal review.
        </p>
      </article>

      <article className="info-card">
        <h3>Core Capabilities</h3>
        <div className="info-grid">
          {focusAreas.map((block) => (
            <div className="info-subcard" key={block.title}>
              <h4>{block.title}</h4>
              <ul>
                {block.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>

      <article className="info-card">
        <h3>Why TrioX Shield</h3>
        <p>
          This project demonstrates how modern web technologies can be used to build
          responsible monitoring tools. By combining API-based collection, pattern analysis,
          and clear reporting, TrioX Shield helps teams move from raw data to actionable insight
          while maintaining compliance and accountability.
        </p>
      </article>
    </section>
  )
}

export default IntroPage
  