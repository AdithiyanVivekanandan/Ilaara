import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIP, sanitizeText, validateEmail, isBot } from '@/lib/security'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const ip = getClientIP(request)

  // Rate limit enquiries — max 3 per minute per IP
  if (!rateLimit(ip, 3, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()

  // Honeypot check
  if (isBot(body.website || '')) {
    return NextResponse.json({ success: true })
  }

  const { name, email, message, isCustomOrder } = body

  if (!name || sanitizeText(name).length < 2) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!message || sanitizeText(message).length < 10) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from('enquiries').insert({
    name: sanitizeText(name),
    email: email.toLowerCase().trim(),
    message: sanitizeText(message),
    is_custom_order: Boolean(isCustomOrder),
  })

  if (error) {
    console.error('Enquiry submission error:', error)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
