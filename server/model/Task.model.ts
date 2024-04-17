import { Schema, model } from 'mongoose'

interface TaskType {
  title: string
  daily: boolean
  startDate: Date
  endDate: Date
  completed: Date[]
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<TaskType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    daily: {
      type: Boolean,
      required: true,
      default: false,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    completed: [
      {
        type: Date,
        default: false,
      },
    ],
  },
  { timestamps: true },
)

const Task = model<TaskType>('Task', taskSchema)

export default Task
