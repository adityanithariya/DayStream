import { startOfDay } from '@utils/date-fns'
import { Schema, model } from 'mongoose'
import type { Completion, Repetition, TaskDocument } from '#types/task'
import { CompletionStatus, Repeat, TimeUnits } from '#types/task'

const CompletionSchema = new Schema<Completion>(
  {
    completedAt: {
      type: Date,
      index: true,
    },
    duration: {
      type: {
        value: Number,
        unit: {
          type: String,
          enum: Object.values(TimeUnits),
        },
        _id: false,
      },
      default: {
        value: 0,
        unit: TimeUnits.MINUTES,
      },
    },
    status: {
      type: String,
      enum: Object.values(CompletionStatus),
      default: CompletionStatus.PENDING,
    },
    notes: String,
  },
  { _id: false },
)

const RepetitionSchema = new Schema<Repetition>(
  {
    type: {
      type: String,
      enum: Object.values(Repeat),
      required: true,
    },
    daysOfWeek: [
      {
        type: Number,
        min: 0,
        max: 6,
      },
    ],
    daysOfMonth: [
      {
        type: Number,
        min: 1,
        max: 31,
      },
    ],
    customDates: [Date],
    // End date for the repetition (optional)
    endsAt: Date,
    // Maximum number of occurrences (optional)
    maxOccurrences: Number,
  },
  { _id: false },
)

const TaskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: 'text', // Enable text search on title
    },
    category: {
      type: String,
      index: true, // Index for faster category-based queries
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    // Repetition configuration
    repetition: RepetitionSchema,
    // Store completions as an array of subdocuments
    completions: [CompletionSchema],
    // Calculated fields for efficient querying
    lastCompletedAt: {
      type: Date,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

TaskSchema.index({ userId: 1, startDate: 1 })
TaskSchema.index({ userId: 1, category: 1 })
TaskSchema.index({ userId: 1, lastCompletedAt: 1 })
TaskSchema.index({ 'repetition.type': 1, userId: 1 })

TaskSchema.methods.isDue = function (
  this: TaskDocument,
  date = new Date(),
): boolean {
  if (!this.active) return false

  const { repetition } = this
  const today = startOfDay(date)

  if (!this.active) return false
  if (this.startDate > today) return false
  if (this.repetition?.endsAt && today > this.repetition.endsAt) return false

  switch (repetition.type) {
    case Repeat.ONCE:
      return startOfDay(this.startDate) <= today
    case Repeat.DAILY:
      return true
    case Repeat.WEEKLY:
      return repetition.daysOfWeek.includes(today.getDay())
    case Repeat.MONTHLY:
      return repetition.daysOfMonth.includes(today.getDate())
    case Repeat.CUSTOM:
      return repetition.customDates.some((d) => startOfDay(d) <= today)
    default:
      return false
  }
}

// TaskSchema.methods.addCompletion = function (completionData: Completion) {
//   this.completions.push(completionData)
//   this.completionRate = this.calculateCompletionRate()
//   return this.save()
// }

// TaskSchema.statics.findDueTasks = function (
//   userId: Types.ObjectId,
//   date = new Date(),
// ) {
//   return this.find({
//     userId,
//     active: true,
//     startDate: { $lte: date },

//   })
// }

const Task = model<TaskDocument>('Task', TaskSchema)

export default Task
