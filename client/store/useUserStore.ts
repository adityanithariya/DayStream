import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LocalState {
  token: string
  setToken: (token: string) => void
}

interface TempState {
  pinAuth: string
  setPin: (pinAuth: string) => void
}

interface MainState {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

export const useLocalStore = create<LocalState>()(
  persist(
    (set) => ({
      token: '',
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'persist-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export const useTempStore = create<TempState>()(
  persist(
    (set) => ({
      pinAuth: '',
      setPin: (pinAuth: string) => set({ pinAuth }),
    }),
    {
      name: 'persist-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

const useUserStore = create<MainState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}))

export default useUserStore
