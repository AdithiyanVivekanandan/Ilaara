import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Proxy configuration for Next.js 16.
 * Handles Authentication, Authorization, and Security Headers.
 */
export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          
          // Re-instantiate the response with updated cookies for the handshake
          supabaseResponse = NextResponse.next({ request })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. ADMIN / DEV PROTECTION LOGIC
  const isAdmin = user.email?.toLowerCase().trim() === process.env.ADMIN_EMAIL?.toLowerCase().trim()
  const isDev = user.email?.toLowerCase().trim() === process.env.DEV_EMAIL?.toLowerCase().trim()

  if (path.startsWith('/admin') && 
      path !== '/admin/login' && 
      path !== '/admin/unauthorized') {

    console.log(`[Proxy] Checking admin access for: ${user?.email || 'Anonymous'} on path: ${path}`)

    if (!user) {
      console.log(`[Proxy] No user found, redirecting to login.`)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (!isAdmin && !isDev) {
      console.log(`[Proxy] User ${user.email} is not authorized for admin.`)
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }
  }

  if (path.startsWith('/dev')) {
    console.log(`[Proxy] Checking dev access for: ${user?.email || 'Anonymous'} on path: ${path}`)

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (!isDev) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }
  }

  // 2. SECURITY HEADERS
  const isLocalDev = process.env.NODE_ENV === 'development'
  
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  supabaseResponse.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${isLocalDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://upload-widget.cloudinary.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://res.cloudinary.com",
    "connect-src 'self' https://*.supabase.co",
    "frame-src https://upload-widget.cloudinary.com",
    "font-src 'self' data:",
  ].join('; ')

  supabaseResponse.headers.set('Content-Security-Policy', csp)

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
