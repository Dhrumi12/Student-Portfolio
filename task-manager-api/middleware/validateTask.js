const allowedFields = new Set(['title', 'description', 'completed', 'priority'])
const priorities = new Set(['low', 'medium', 'high'])

export function validateTask(req, res, next) {
  const body = req.body || {}
  const details = []

  if (req.method === 'POST' && (typeof body.title !== 'string' || !body.title.trim())) {
    details.push('Title is required')
  }

  if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) {
    details.push('Title must be a non-empty string')
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    details.push('Description must be a string')
  }
  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    details.push('Completed must be a boolean')
  }
  if (body.priority !== undefined && !priorities.has(body.priority)) {
    details.push('Priority must be low, medium, or high')
  }

  const unknownFields = Object.keys(body).filter((field) => !allowedFields.has(field))
  if (unknownFields.length) details.push(`Unsupported field: ${unknownFields[0]}`)

  if (details.length) return res.status(400).json({ error: 'Validation failed', details })
  if (typeof body.title === 'string') body.title = body.title.trim()
  next()
}
