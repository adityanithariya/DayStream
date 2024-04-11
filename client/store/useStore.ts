import { create } from 'zustand'

interface State {
  counter: number
  increase: (by: number) => void
}

const useStore = create<State>((set) => ({
  counter: 0,
  increase: (by: number) => set((state) => ({ counter: state.counter + by })),
}))

export default useStore
