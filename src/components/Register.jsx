import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api.js'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await registerUser({ email: form.email, password: form.password })
      navigate('/login?registered=1', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to register.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-card auth-card">
      <h1>Create account</h1>
      {error && <p className="status-box error-box">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="contact-label" htmlFor="register-email">Email</label>
        <input id="register-email" className="contact-input" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        <label className="contact-label contact-label-spaced" htmlFor="register-password">Password</label>
        <input id="register-password" className="contact-input" name="password" type="password" value={form.password} onChange={handleChange} minLength="6" required autoComplete="new-password" />
        <label className="contact-label contact-label-spaced" htmlFor="register-confirm-password">Confirm password</label>
        <input id="register-confirm-password" className="contact-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} minLength="6" required autoComplete="new-password" />
        <button type="submit" className="toggle-btn auth-submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
      </form>
      <p className="auth-link">Already registered? <Link to="/login">Log in</Link></p>
    </section>
  )
}

export default Register
