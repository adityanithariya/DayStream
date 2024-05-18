import type { AuthState } from '@type/auth'
import { create } from 'zustand'

const useAuthStore = create<AuthState>((set) => ({
  username: {
    value: '',
    requiredError: false,
    usernameAvailable: false,
  },
  email: {
    value: '',
    requiredError: false,
  },
  password: {
    value: '',
    requiredError: false,
    showPassword: false,
  },
  setUsername: (value: string) =>
    set((state) => ({ username: { ...state.username, value } })),
  setEmail: (value: string) =>
    set((state) => ({ email: { ...state.email, value } })),
  setPassword: (value: string) =>
    set((state) => ({ password: { ...state.password, value } })),
  setShowPassword: (value: boolean) =>
    set((state) => ({ password: { ...state.password, showPassword: value } })),
  setUsernameAvailable: (value: boolean) =>
    set((state) => ({
      username: { ...state.username, usernameAvailable: value },
    })),
  setRequiredError: (
    field: 'username' | 'email' | 'password',
    value: boolean,
  ) => set((state) => ({ [field]: { ...state[field], requiredError: value } })),
}))

export default useAuthStore
