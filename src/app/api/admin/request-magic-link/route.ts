import { Resend } from 'resend'
import { validateEmail } from '@/lib/security'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.json()
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : ''

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const allowedEmails = [process.env.ADMIN_EMAIL, process.env.DEV_EMAIL]
    .filter(Boolean)
    .map((value) => value!.toLowerCase().trim())

  if (!allowedEmails.includes(email)) {
    return NextResponse.json({ error: 'Unauthorized email' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createAdminClient()

  const origin = new URL(request.url).origin
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || origin}/api/auth/confirm?next=/admin`

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const link = data?.properties?.action_link

  if (!link) {
    return NextResponse.json({ error: 'Unable to generate magic link' }, { status: 500 })
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'ILAARA <onboarding@resend.dev>'

  try {
    const { error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Your ILAARA admin magic link',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px; color: #1f1f1f; background: #faf9f6;">
          <h1 style="color: #8b0000; letter-spacing: 0.35em; text-transform: uppercase; font-weight: 400; margin: 0 0 24px;">ILAARA</h1>
          <p style="font-size: 18px; line-height: 1.6; margin: 0 0 24px;">Use the button below to sign in to the admin portal.</p>
          <p style="margin: 32px 0;">
            <a href="${link}" style="display: inline-block; background: #8b0000; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; font-weight: 700;">Open Admin Portal</a>
          </p>
          <p style="font-size: 12px; line-height: 1.6; color: #666;">If the button does not work, paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px; color: #8b0000;">${link}</p>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-top: 40px;">This link expires shortly for security.</p>
        </div>
      `,
      text: `Open the ILAARA admin portal: ${link}`,
    })

    if (resendError) {
      console.error('Resend send error:', resendError)
      return NextResponse.json(
        {
          error: resendError.message,
          resendCode: resendError.name,
        },
        { status: resendError.statusCode || 500 }
      )
    }
  } catch (emailError) {
    console.error('Resend send error:', emailError)
    const message =
      emailError instanceof Error
        ? emailError.message
        : 'Error sending magic link email'

    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
