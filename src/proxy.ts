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

  // 1. ADMIN PROTECTION LOGIC
  if (path.startsWith('/admin') && 
      path !== '/admin/login' && 
      path !== '/admin/unauthorized') {
    
    // Not logged in
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Authorized check (Strict email matching)
    if (user.email?.toLowerCase().trim() !== process.env.ADMIN_EMAIL?.toLowerCase().trim()) {
      // Redirect to unauthorized page instead of home for better UX/Debugging
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }
  }

  // 2. SECURITY HEADERS
  const isDev = process.env.NODE_ENV === 'development'
  
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://checkout.razorpay.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://res.cloudinary.com",
    "connect-src 'self' https://*.supabase.co https://api.razorpay.com",
    "frame-src https://api.razorpay.com",
    "font-src 'self' data:",
  ].join('; ')

  supabaseResponse.headers.set('Content-Security-Policy', csp)

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
