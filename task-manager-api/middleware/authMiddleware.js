import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
  const authorization = req.get('Authorization')
  const [scheme, token] = authorization?.split(' ') || []

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication token required' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
