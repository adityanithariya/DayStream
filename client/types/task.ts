import type { IUser } from './auth'

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

export enum Repeat {
  ONCE = 'once',
  EVERYDAY = 'everyday',
  CUSTOM = 'custom',
}

export interface ITask {
  title: string
  repeat: Repeat
  customDays?: Days[]
  completed?: Date[]
  startDate?: Date
  endDate?: Date
  _id?: string
  createdAt?: Date
  updatedAt?: Date
}
