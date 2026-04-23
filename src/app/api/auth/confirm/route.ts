import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/admin'

  if (token_hash && type) {
    const supabase = await createClient()

    // 1. Verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error && data.session) {
      console.log(`[AuthConfirm] Session established for: ${data.user?.email}`)
      
      // 2. Clear out any previous "error" params and go to the dashboard
      const response = NextResponse.redirect(new URL(next, request.url))
      
      // Force cookies to be sent immediately
      return response
    } else {
      console.error(`[AuthConfirm] Verification failed: ${error?.message || 'No session created'}`)
    }
  }

  console.warn(`[AuthConfirm] Auth path failed. Redirecting to login.`)
  return NextResponse.redirect(new URL('/admin/login?error=confirmation-failed', request.url))
}
