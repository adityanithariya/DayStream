import type { Days, ITask, Repetition } from '@type/task'
import { Repeat } from '@type/task'
import { startOfDay } from 'date-fns'
import { create } from 'zustand'

interface TaskState extends ITask {
  setTitle: (title: string) => void
  setCategory: (category: string) => void
  setStartDate: (startDate: Date) => void
  setRepetition: (repetition: Repetition) => void
  setEndDate: (endDate: Date) => void
  toggleDaysOfWeek: (day: Days) => void
  toggleDaysOfMonth: (day: number) => void
  setCustomDates: (dates: Date[]) => void
}

const useAddTaskStore = create<TaskState>((set) => ({
  title: '',
  startDate: startOfDay(new Date()),
  repetition: {
    type: Repeat.ONCE,
    endsAt: new Date(startOfDay(new Date()).getTime() + 36_00_000 * 24 * 30),
  },
  active: true,

  setTitle: (title) => set({ title }),
  setCategory: (category) => set({ category }),
  setStartDate: (startDate) => set({ startDate }),
  setRepetition: (repetition) =>
    set((state) => ({ repetition: { ...state.repetition, ...repetition } })),
  setEndDate: (endDate) =>
    set((state) => ({ repetition: { ...state.repetition, endsAt: endDate } })),
  toggleDaysOfWeek: (day) =>
    set((state) => {
      const daysOfWeek = state.repetition?.daysOfWeek || []
      const newDaysOfWeek = daysOfWeek.includes(day)
        ? daysOfWeek.filter((d) => d !== day)
        : [...daysOfWeek, day]

      return {
        repetition: {
          ...state.repetition,
          daysOfWeek: newDaysOfWeek,
        },
      }
    }),
  toggleDaysOfMonth: (day) =>
    set((state) => {
      const daysOfMonth = state.repetition?.daysOfMonth || []
      const newDaysOfMonth = daysOfMonth.includes(day)
        ? daysOfMonth.filter((d) => d !== day)
        : [...daysOfMonth, day]

      return {
        repetition: {
          ...state.repetition,
          daysOfMonth: newDaysOfMonth,
        },
      }
    }),
  setCustomDates: (dates) =>
    set((state) => ({
      repetition: {
        ...state.repetition,
        customDates: dates,
      },
    })),
}))

export default useAddTaskStore
