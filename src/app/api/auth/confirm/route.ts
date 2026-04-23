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

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      console.log(`[AuthConfirm] Successfully verified magic link. Redirecting to ${next}`)
      return NextResponse.redirect(new URL(next, request.url))
    } else {
      console.error(`[AuthConfirm] Verification error: ${error.message}`)
    }
  }

  console.warn(`[AuthConfirm] Failed verification or missing parameters. Redirecting to login.`)
  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/admin/login?error=auth-failed', request.url))
}
