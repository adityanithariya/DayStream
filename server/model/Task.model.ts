import { type Document, Schema, type Types, model } from 'mongoose'

export enum Days {
  SUN = 'Sun',
  MON = 'Mon',
  TUE = 'Tue',
  WED = 'Wed',
  THU = 'Thu',
  FRI = 'Fri',
  SAT = 'Sat',
}

export enum Repeat {
  ONCE = 'once',
  EVERYDAY = 'everyday',
  CUSTOM = 'custom',
}

export interface TaskDocument extends Document {
  title: string
  user: Types.ObjectId
  repeat: Repeat
  customDays?: Days[]
  startDate?: Date
  endDate?: Date
  completed: Date[]
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
  repeat: {
    type: String,
    enum: Object.values(Repeat),
    default: Repeat.ONCE,
  },
  customDays: {
    type: [String],
    enum: Object.values(Days),
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  completed: {
    type: [Date],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

taskSchema.index({ title: 1, repeat: 1, startDate: 1, endDate: 1 })

const Task = model<TaskDocument>('Task', taskSchema)

export default Task
