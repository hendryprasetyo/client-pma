import { Request } from '@/lib/Axios'
import { TResponseApi } from '@/types/type'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  name: string
  password: string
  confirm_password: string
}

export interface LoginResponse {
  access_token: string
}

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await Request.post<TResponseApi<LoginResponse>>(
    '/api/auth/login',
    payload
  )
  return data
}

export const logout = async () => {
  const { data } = await Request.post<TResponseApi<null>>('/api/auth/logout')
  return data
}

export const userProfile = async (userid: string) => {
  const { data } = await Request.get<
    TResponseApi<{ id: string; name: string; email: string }>
  >(`/api/users/${userid}`)
  return data
}

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await Request.post<TResponseApi<null>>(
    '/api/auth/register',
    payload
  )
  return data
}
