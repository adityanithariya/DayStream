import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

console.log(process.env.SERVER_BASE_URL)

const api: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token')
    const authenticatedPIN = sessionStorage.getItem('pin-auth')
    console.log(authenticatedPIN)
    if (token) config.headers.Authorization = `Bearer ${token}`
    if (authenticatedPIN) config.headers.pinAuth = authenticatedPIN
    return config
  },
  (error) => Promise.reject(error),
)

export default api
