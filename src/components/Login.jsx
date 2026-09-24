import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../api.js'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const expired = new URLSearchParams(location.search).get('reason') === 'expired'
  const registered = new URLSearchParams(location.search).get('registered') === '1'

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginUser(form)
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      navigate('/projects', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to log in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-card auth-card">
      <h1>Welcome back</h1>
      {expired && <p className="status-box error-box">Session expired. Please log in again.</p>}
      {registered && <p className="status-box success-box">Registration successful. Please log in.</p>}
      {error && <p className="status-box error-box">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="contact-label" htmlFor="login-email">Email</label>
        <input id="login-email" className="contact-input" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        <label className="contact-label contact-label-spaced" htmlFor="login-password">Password</label>
        <input id="login-password" className="contact-input" name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
        <button type="submit" className="toggle-btn auth-submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="auth-link">No account? <Link to="/register">Create one</Link></p>
    </section>
  )
}

export default Login
