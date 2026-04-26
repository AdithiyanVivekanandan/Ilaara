import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const code = searchParams.get('code')
  const type = searchParams.get('type') as EmailOtpType | null
  const requestedNext = searchParams.get('next') ?? '/admin'
  const allowedPaths = ['/admin', '/dev', '/']
  const next = allowedPaths.includes(requestedNext) ? requestedNext : requestedNext.startsWith('/admin') ? '/admin' : requestedNext.startsWith('/dev') ? '/dev' : '/admin'

  if (token_hash && type) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
    
    if (!error && data.session) {
      console.log(`[AuthConfirm] TokenHash verified. Session established.`)
      return NextResponse.redirect(new URL(next, request.url))
    }
    console.error(`[AuthConfirm] TokenHash error: ${error?.message}`)
  } 
  
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      console.log(`[AuthConfirm] Code exchanged. Session established for ${data.user?.email}`)
      return NextResponse.redirect(new URL(next, request.url))
    }
    console.error(`[AuthConfirm] Code exchange error: ${error?.message}`)
  }

  console.warn(`[AuthConfirm] Failed verification. Check Site URL settings.`)
  return NextResponse.redirect(new URL('/admin/login?error=confirmation-failed', request.url))
}
