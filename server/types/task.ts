import type { Model, Types } from 'mongoose'

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
  duration: {
    value: number
    unit: TimeUnits
  }
  status: CompletionStatus
  notes: string
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
  maxOccurrences?: number
}

export interface ITask {
  title: string
  category?: string
  startDate: Date
  repetition: Repetition
  completions: Completion[]
  lastCompletedAt?: Date
  completionRate: number
  active: boolean
  user: Types.ObjectId
}

export interface TaskDocument extends ITask, Document {
  addCompletion(completionData: Partial<Completion>): Promise<TaskDocument>
  isDue(this: TaskDocument, date: Date): boolean
}

export interface TaskModel extends Model<TaskDocument> {
  findDueTasks(userId: Types.ObjectId, date?: Date): Promise<TaskDocument[]>
}

export interface GetDueTasksQuery {
  page?: string
  limit?: string
  date?: string
  category?: string
}
