import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SocialMediaPage from './pages/SocialMediaPage'
import DarkWebCrawlPage from './pages/DarkWebCrawlPage'
import ForumLinkPage from './pages/ForumLinkPage'
import PatternAnalysisPage from './pages/PatternAnalysisPage'
import IntroPage from './pages/IntroPage'
import TeamPage from './pages/TeamPage'

const services = [
  {
    label: 'Track All Social Media Content Related',
    path: '/social-monitoring'
  },
  {
    label: 'Dark Web Crawl',
    path: '/dark-web-crawl'
  },
  {
    label: 'Find Forum Links Where Dark Talking',
    path: '/forum-links'
  },
  {
    label: 'Analysis Dark Web Pattern Of Website Activity',
    path: '/pattern-analysis'
  }
]

const extraPages = [
  { label: 'Intro & Use Case', path: '/intro' },
  { label: 'Team', path: '/team' }
]

function App() {
  return (
    <div className="dashboard-shell">
      <header className="app-header">
        <div className="header-cluster">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Emblem_of_India_with_transparent_background.png" width={90} height={100} alt="" />
        </div>
        <div className="brand-center" aria-label="TrioX brand">
          <span className="brand-text">Shield Hackathon </span>
        </div>
        <div className="header-cluster">
          <div className="logo-pill" aria-hidden="true" />
          <img src="https://bprd.cdtijaipur.in/wp-content/uploads/2024/01/Group-202.png" alt="" />
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <p className="sidebar-label">Services</p>
          <ol className="service-list">
            {services.map((service) => (
              <li key={service.path}>
                <NavLink
                  to={service.path}
                  className={({ isActive }) =>
                    `service-nav ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="service-check" />
                  <span className="service-text">{service.label}</span>
                </NavLink>
              </li>
            ))}
          </ol>
          <hr className="sidebar-divider" />
          <ol className="service-list">
            {extraPages.map((page) => (
              <li key={page.path}>
                <NavLink
                  to={page.path}
                  className={({ isActive }) =>
                    `service-nav ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="service-check" />
                  <span className="service-text">{page.label}</span>
                </NavLink>
              </li>
            ))}
          </ol>
          <div className="uptime-glance">
            <p>Websites Alive</p>
            <strong>04 tracked / 312h</strong>
          </div>
        </aside>

        <main className="intel-space">
          <Routes>
            <Route path="/" element={<Navigate to="/social-monitoring" replace />} />
            <Route path="/social-monitoring" element={<SocialMediaPage />} />
            <Route path="/dark-web-crawl" element={<DarkWebCrawlPage />} />
            <Route path="/forum-links" element={<ForumLinkPage />} />
            <Route path="/pattern-analysis" element={<PatternAnalysisPage />} />
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
