import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { createNEMO, type GlobalMiddlewareConfig, type MiddlewareConfig } from '@rescale/nemo'
import { cookies } from 'next/headers'
import { v7 as uuidv7 } from 'uuid'
import { isProd } from './lib/actions'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico|members/*).*)',
  ],
}

const globalMiddlewares = {
  before: async (request,) => {
    const requestHeaders = new Headers(request.headers)
    const url = request.url
    requestHeaders.set('x-url', url)

    const _cookies = await cookies()
    let sessionId = _cookies.get('session_id')?.value as string
    if (!sessionId) {
      const uuid = uuidv7()
      sessionId = uuid.replaceAll('-', '')

      const prod = await isProd()
      _cookies.set('session_id', sessionId, {
        secure: prod,
        sameSite: 'lax',
        httpOnly: true,
      })
    }
  }
} satisfies GlobalMiddlewareConfig

const middlewares = {
  '/': [
    async () => {
      const _cookies = await cookies()
      let sessionId = _cookies.get('session_id')?.value as string
      if (!sessionId) {
        const uuid = uuidv7()
        sessionId = uuid.replaceAll('-', '')

        _cookies.set('session_id', sessionId, {
          secure: true,
          sameSite: true,
        })
      }
    },
    async (request: NextRequest) => {
      if (!request.url.endsWith('/maintenance') && process.env.MAINTENANCE_MODE === 'true') {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
      const requestHeaders = new Headers(request.headers)
      const url = request.url
      
      requestHeaders.set('x-url', url)

      // You can also set request headers in NextResponse.next
      const response = NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      })
    
      response.headers.set('x-url', url)
      return response
    },
  ],
  '/payload/:payloadId*': [
    async (request: NextRequest) => {
      const requestHeaders = new Headers(request.headers)
      const url = request.url
      
      requestHeaders.set('x-url', url)
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
      response.headers.set('x-url', url)
      return response
    },
  ],
} satisfies MiddlewareConfig

export const middleware = createNEMO(middlewares, globalMiddlewares)