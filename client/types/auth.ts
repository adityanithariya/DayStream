export enum Action {
  LOGIN = 'login',
  SIGNUP = 'signup',
  GOOGLE = 'google',
  GITHUB = 'github',
}

export type AuthPageProps = {
  params?: {
    action?: Action
  }
}

export interface AuthState {
  username: {
    value: string
    requiredError: boolean
    usernameAvailable: boolean
  }
  email: { value: string; requiredError: boolean }
  password: { value: string; requiredError: boolean; showPassword: boolean }
  setUsername: (value: string) => void
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setShowPassword: (value: boolean) => void
  setUsernameAvailable: (value: boolean) => void
  setRequiredError: (
    field: 'username' | 'email' | 'password',
    value: boolean,
  ) => void
}
