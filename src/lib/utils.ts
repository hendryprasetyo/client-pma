import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { jwtDecode } from 'jwt-decode'
import routes from './Routes'
import { TypeRoutes } from '@/types/type'
import Moment from 'moment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeJwt = <T>(token: string): T => {
  const decoded = jwtDecode(token)
  return decoded as T
}

export const checkRoute = (
  routeType: keyof TypeRoutes,
  pathname: string
): boolean => {
  return routes.some(route => pathname === route.path && route[routeType])
}

export const generateTransactionId = () => {
  const appId = 'AWB32'
  const identifierString = '00000'
  // Asia/Jakarta = UTC+7 → offset dalam menit = 7 * 60 = 420
  const timeStamp = Moment().utcOffset(420).format('YYMMDDHHmmssSSS')
  const changeableDigit = '0'

  return [appId, timeStamp, identifierString, changeableDigit].join('')
}
