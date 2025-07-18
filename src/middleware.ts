import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Env } from '@/lib/Env'
import { checkRoute } from '@/lib/utils'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()
  const isProtectedRoute = checkRoute('protected', pathname)
  const isUnProtectedRoute = checkRoute('unprotected', pathname)
  const accessToken =
    request.cookies.get(Env.KEY_COOKIE_ACCESS_TOKEN!)?.value || null
  if (isProtectedRoute && !accessToken) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isUnProtectedRoute && !!accessToken) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
