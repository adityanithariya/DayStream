import type { Days, ITask } from '@type/task'
import { Repeat } from '@type/task'
import { create } from 'zustand'

interface AddTask {
  shadowRepeat: Repeat
  setTitle: (title: string) => void
  setRepeat: (repeat: Repeat) => void
  setStartDate: (date: Date) => void
  setEndDate: (date: Date) => void
  toggleDay: (day: Days) => void
}

const useAddTaskStore = create<ITask & AddTask>((set) => ({
  title: '',
  shadowRepeat: Repeat.ONCE,
  repeat: Repeat.ONCE,
  startDate: new Date(),
  endDate: new Date(Date.now() + 3600000),
  setTitle: (title) => set({ title }),
  setRepeat: (repeat) =>
    set((state) => ({
      shadowRepeat: repeat,
      repeat:
        repeat === Repeat.CUSTOM
          ? state.customDays?.length
            ? state.customDays?.length === 7
              ? Repeat.EVERYDAY
              : Repeat.CUSTOM
            : Repeat.ONCE
          : repeat,
    })),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  toggleDay: (day) =>
    set((state) => ({
      customDays: state.customDays?.includes(day)
        ? state.customDays.filter((d) => d !== day)
        : [...(state.customDays || []), day],
      repeat: state.customDays?.length
        ? state.customDays?.length === 6 && !state.customDays?.includes(day)
          ? Repeat.EVERYDAY
          : Repeat.CUSTOM
        : Repeat.ONCE,
    })),
}))

export default useAddTaskStore
