function Footer({ email }) {
  return (
    <footer className="section-card footer-section">
      <p>
        Contact me at <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>
        <a href="https://github.com/Dhrumi12" target="_blank" rel="noreferrer">
          Visit my GitHub profile
        </a>
      </p>
      <p>© {new Date().getFullYear()} Student Portfolio</p>
    </footer>
  )
}

export default Footer
