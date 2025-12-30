const teamMembers = [
  {
    name: 'Raghav Arora',
    role: 'Team Leader · Frontend Engineer',
    education: 'BCA (Cybersecurity) · Semester 1 · Poornima University, Jaipur',
    bio: `
Founder and technical lead of the TrioX project. Responsible for designing and
developing the complete frontend architecture, UI flow, and dashboard experience.
Has prior exposure to cybersecurity fundamentals and vulnerability assessment concepts.
`
  },
  {
    name: 'Vanshika Arora',
    role: 'Full Stack Developer',
    education: 'BCA (Full Stack Web Development) · Apex University',
    bio: `
Handled backend logic planning, API flow design, and overall system workflow.
Actively involved in structuring how data moves through the application and
how different modules interact with each other.
`
  },
  {
    name: 'Ritika Arora',
    role: 'Documentation & Digital Strategy',
    education: 'MBA (Digital Marketing) · Vivekananda Global University, Jaipur',
    bio: `
Led project documentation, presentation decks, and coordination.
Responsible for preparing structured PPTs, summaries, and ensuring the
project narrative is clear, presentable, and aligned with evaluation criteria.
`
  }
]

const TeamPage = () => {
  return (
    <section className="team-page">
      <header className="section-heading">
        <p>Team TrioX</p>
        <h2>Project Contributors</h2>
        <span>
          A small interdisciplinary team combining cybersecurity, development,
          and documentation expertise.
        </span>
      </header>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <article className="team-card" key={member.name}>
            <h3>{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <p className="team-education">{member.education}</p>
            <p className="team-bio">{member.bio}</p>
          </article>
        ))}
      </div>

      <article className="info-card">
        <h3>Team Collaboration</h3>
        <p>
          TrioX is a collaborative academic project developed by siblings working
          together across different disciplines. The frontend, system workflow,
          and documentation were built in close coordination to ensure clarity,
          usability, and a cohesive final presentation.
        </p>
      </article>
    </section>
  )
}

export default TeamPage
