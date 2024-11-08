export enum Days {
  Sun = 'Sun',
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'Thu',
  Fri = 'Fri',
  Sat = 'Sat',
}

export type MarkDays = {
  [keyof in Days]: boolean
}

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
  completedAt?: Date
  duration?: {
    value: number
    unit: TimeUnits
  }
  status?: CompletionStatus
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
  type?: Repeat
  endsAt?: Date
  maxOccurrences?: number
  daysOfWeek?: Array<number | Days>
  daysOfMonth?: number[]
  customDates?: Date[]
}

export interface ITask {
  title: string
  category?: string
  startDate: Date
  repetition: Repetition
  completions?: Completion[]
  lastCompletedAt?: Date
  completionRate?: number
  active: boolean
}
export interface ITaskEdit {
  id: string
  title?: string
  category?: string
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

export type ITasks = {
  [id: string]: ITaskEdit
}
