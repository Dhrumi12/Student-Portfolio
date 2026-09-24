import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
)

taskSchema.pre('save', function trimTitle(next) {
  if (this.title) {
    this.title = this.title.trim()
  }

  next()
})

export default mongoose.model('Task', taskSchema)