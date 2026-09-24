import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import Contact from './models/Contact.js'
import Task from './models/Task.js'
import User from './models/User.js'
import authMiddleware from './middleware/authMiddleware.js'
import { validateCredentials } from './middleware/validateAuth.js'
import { validateTask } from './middleware/validateTask.js'
import requestLogger from './middleware/requestLogger.js'
import requireJson from './middleware/requireJson.js'

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger)

// Connect to MongoDB
const port = process.env.PORT || 5001

app.get('/', (req, res) => {
  res.json({ message: 'Student Portfolio API is running' })
})

app.post('/register', requireJson, validateCredentials, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase()
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(409).json({ error: 'Email is already registered' })

    const password = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({ email, password })
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email },
    })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Email is already registered' })
    next(error)
  }
})

app.post('/login', requireJson, validateCredentials, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase()
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email },
    })
  } catch (error) {
    next(error)
  }
})

app.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ id: user._id, email: user.email })
  } catch (error) {
    next(error)
  }
})

app.post('/contacts', requireJson, async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body)
    res.status(201).json({ message: 'Contact message saved successfully', contact })
  } catch (error) {
    next(error)
  }
})

app.get('/contacts', async (req, res, next) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }))
  } catch (error) {
    next(error)
  }
})

app.get('/tasks', authMiddleware, async (req, res, next) => {
  try {
    res.json(await Task.find().sort({ createdAt: -1 }))
  } catch (error) {
    next(error)
  }
})

app.get('/tasks/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (error) {
    next(error)
  }
})

app.post('/tasks', authMiddleware, requireJson, validateTask, async (req, res, next) => {
  try {
    res.status(201).json(await Task.create(req.body))
  } catch (error) {
    next(error)
  }
})

app.put('/tasks/:id', authMiddleware, requireJson, validateTask, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (error) {
    next(error)
  }
})

app.delete('/tasks/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
})

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.use((error, req, res, _next) => {
  if (error.name === 'ValidationError') {
    const details = Object.fromEntries(
      Object.entries(error.errors).map(([field, fieldError]) => [field, fieldError.message]),
    )
    return res.status(400).json({ error: 'Validation failed', details })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

export async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured. Check task-manager-api/.env.')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Check task-manager-api/.env.')
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  console.log('MongoDB connected')
  return app.listen(port, () => console.log(`Task API listening on http://localhost:${port}`))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch((error) => {
    console.error('Unable to start server. Check MongoDB and MONGO_URI:', error.message)
    process.exit(1)
  })
}

export default app