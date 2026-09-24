function Header({ name, themeColor }) {
  return (
    <header className="section-card header-section">
      <p className="eyebrow">Student Portfolio</p>
      <h1 className="header-title" style={{ color: themeColor }}>
        Hi, I&apos;m {name}
      </h1>
      <p className="header-description">
        A front-end learner building reusable React components and clean UI.
      </p>
    </header>
  )
}

export default Header
