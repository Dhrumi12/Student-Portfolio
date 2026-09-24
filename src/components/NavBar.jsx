import { NavLink, useLocation, useNavigate } from 'react-router-dom'

function NavBar({ darkMode, onToggleTheme }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = Boolean(localStorage.getItem('token'))
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="top-nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Home
      </NavLink>
      <NavLink to="/projects" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Projects
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Contact
      </NavLink>
      {isLoggedIn ? (
        <>
          <span className="login-status" title={user?.email || 'Authenticated user'}>
            Logged in{user?.email ? `: ${user.email}` : ''}
          </span>
          <button type="button" className="nav-link nav-button" onClick={handleLogout}>Logout</button>
        </>
      ) : location.pathname !== '/login' && location.pathname !== '/register' ? (
        <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Login
        </NavLink>
      ) : null}
      <button type="button" className="nav-link nav-button" onClick={onToggleTheme}>
        {darkMode ? 'Light mode' : 'Dark mode'}
      </button>
    </nav>
  )
}

export default NavBar
