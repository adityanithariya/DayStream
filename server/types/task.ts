import type { Types } from 'mongoose'
import type { Pagination } from './common'

export enum TimeUnits {
  MINUTES = 'minutes',
  HOURS = 'hours',
}

export enum CompletionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  PARTIAL = 'partial',
  FAILED = 'failed',
}

export interface Completion {
  completedAt: Date
  duration?: {
    value: number
    unit: TimeUnits
  }
  status: CompletionStatus
  notes?: string
}

export enum Repeat {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export interface Repetition {
  type: Repeat
  daysOfWeek: number[]
  daysOfMonth: number[]
  customDates: Date[]
  endsAt?: Date
}

export interface ITask {
  title: string
  category?: Types.ObjectId
  startDate: Date
  repetition: Repetition
  completions: Completion[]
  lastCompletedAt?: Date
  completionRate: number
  active: boolean
  user: Types.ObjectId
}

export interface TaskDocument extends ITask, Document {
  isDue(this: TaskDocument, date?: Date): boolean
}

export interface GetDueTasksQuery extends Pagination {
  date?: string
  category?: string
}

export interface UpdateTaskBody {
  title?: string
  category?: string
  startDate?: string
  repetition?: Repetition
  completion?: {
    completedAt?: Date
    duration?: {
      value: number
      unit: TimeUnits
    }
    status?: CompletionStatus
    notes?: string
  }
  active?: boolean
}
