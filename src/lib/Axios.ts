import { useAuthStore } from '@/stores/Auth'
import Axios from 'axios'
import { Env } from './Env'
import { generateTransactionId } from './utils'
export const Request = Axios.create({
  baseURL: Env.NEXT_PUBLIC_API_URL,
  headers: {
    accept: 'application/json',
    transactionid: generateTransactionId(),
  },
  timeout: 10000,
  withCredentials: true,
})

Request.interceptors.request.use(
  config => {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => Promise.reject(error)
)

Request.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        // Optional: Panggil API logout (jika ada endpoint khusus)
        await Request.post('/api/auth/logout')
      } catch (logoutError) {
        console.error('Logout API failed', logoutError)
      }

      // Clear local auth state
      useAuthStore.getState().logout()
      document.cookie = '__access_token__=; Max-Age=0; Path=/'
      // Optional: Redirect ke login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
