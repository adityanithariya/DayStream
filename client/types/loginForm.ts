import type { FieldError, UseFormRegister } from 'react-hook-form'

export type FormData = {
  username: string
  email: string
  password: string
}

export type FormFieldProps = {
  type: string
  placeholder: string
  name: keyof FormData
  register: UseFormRegister<FormData>
  error: FieldError | undefined
  valueAsNumber?: boolean
}
