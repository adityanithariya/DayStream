import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface DueTasksState {
  dueTaskIds?: string[]
  setDueTaskIds: (ids: string[]) => void
  reorderDueTasks: (oldIndex: number, newIndex: number) => void
}

const useDueTasksStore = create<DueTasksState>()(
  persist(
    (set) => ({
      setDueTaskIds: (ids: string[]) => set({ dueTaskIds: ids }),
      reorderDueTasks: (oldIndex: number, newIndex: number) => {
        set((state) => {
          const updatedIds = [...(state.dueTaskIds || [])]
          const [removedId] = updatedIds.splice(oldIndex, 1)
          updatedIds.splice(newIndex, 0, removedId)
          return { dueTaskIds: updatedIds }
        })
      },
    }),
    {
      name: 'due-tasks-order',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useDueTasksStore
