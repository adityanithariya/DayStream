import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { usePathname, useRouter } from 'next/navigation'

interface IAPI extends AxiosInstance {
  fetcher?: any
}

const useAPI = () => {
  const API: IAPI = axios.create({
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
      const pin = sessionStorage.getItem('pin-auth')
      if (token) config.headers.token = token
      if (pin) config.headers.pinAuth = pin
      return config
    },
  )
  API.interceptors.response.use(
    (response) => response,
    (error: any) => {
      const { status, data } = error.response
      if (status === 401) {
        // if (process.env.NODE_ENV === 'development') return Promise.resolve()
        if (data?.code === 'pin-auth-failed') {
          if (!pathname.startsWith('/pin')) replace(`/pin?next=${pathname}`)
        } else if (!pathname.startsWith('/auth')) {
          replace(`/auth/login?next=${pathname}`)
        }
        return Promise.reject(error)
      }
      // toastError(data?.message || 'An error occurred. Please try again.')
      return Promise.reject(error)
    },
  )
  API.fetcher = (url: string) => API.get(url).then((res) => res.data)
  return API
}

export default useAPI
