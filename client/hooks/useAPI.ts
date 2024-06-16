import { toastError } from '@lib/toast'
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { usePathname, useRouter } from 'next/navigation'

const useAPI = () => {
  const API: AxiosInstance = axios.create({
    baseURL: process.env.SERVER_BASE_URL as string,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

  const { replace } = useRouter()
  const pathname = usePathname()

  API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem('token')
      const authenticatedPIN = sessionStorage.getItem('pin-auth')
      if (token) config.headers.token = token
      if (authenticatedPIN) config.headers.pinAuth = authenticatedPIN
      return config
    },
  )
  API.interceptors.response.use(
    (response) => response,
    (error: any) => {
      const { status, data } = error.response
      if (status === 401) {
        if (data?.code === 'pin-auth-failed') {
          if (!pathname.startsWith('/pin')) replace(`/pin?next=${pathname}`)
        } else if (!pathname.startsWith('/auth')) {
          replace(`/auth/login?next=${pathname}`)
        }
        return Promise.reject(error)
      }
      toastError(data?.message || 'An error occurred. Please try again.')
      return Promise.reject(error)
    },
  )
  return API
}

export default useAPI
