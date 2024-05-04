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

  const navigate = useRouter()
  const pathname = usePathname()

  API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      console.log('sending')
      const token = localStorage.getItem('token')
      const authenticatedPIN = sessionStorage.getItem('pin-auth')
      console.log(authenticatedPIN)
      if (token) config.headers.Authorization = `Bearer ${token}`
      if (authenticatedPIN) config.headers.pinAuth = authenticatedPIN
      return config
    },
  )
  API.interceptors.response.use(
    (response) => response,
    (error: any) => {
      const { status, data } = error.response
      if (status === 401) {
        if (data?.code === 'pin-auth-failed')
          navigate.replace(`/pin?next=${pathname}`)
        else navigate.replace(`/login?next=${pathname}`)
      } else return Promise.reject(error)
      return Promise.resolve(error)
    },
  )
  return API
}

export default useAPI
