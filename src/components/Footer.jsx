function Footer({ email }) {
  return (
    <footer className="section-card footer-section">
      <p>
        Contact me at <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>© {new Date().getFullYear()} Student Portfolio</p>
    </footer>
  )
}

export default Footer
