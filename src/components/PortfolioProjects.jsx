function PortfolioProjects({ projects }) {
  return (
    <section className="section-card portfolio-projects">
      <h2>Projects</h2>
      <div className="portfolio-project-grid">
        {projects.map((project) => (
          <article className="portfolio-project" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PortfolioProjects