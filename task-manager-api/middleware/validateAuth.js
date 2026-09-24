const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateCredentials(req, res, next) {
  const { email, password } = req.body || {}
  const details = []

  if (typeof email !== 'string' || !email.trim()) details.push('Email is required')
  else if (!emailPattern.test(email.trim())) details.push('Email must be valid')
  if (typeof password !== 'string' || !password) details.push('Password is required')
  else if (password.length < 6) details.push('Password must be at least 6 characters')

  if (details.length) return res.status(400).json({ error: 'Validation failed', details })
  next()
}
