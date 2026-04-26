import crypto from 'crypto'

// Rate limiting store — in memory for now
// For production scale, replace with Redis via Upstash
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()

  // Cleanup stale entries to avoid in-memory leak
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }

  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (record.count >= maxRequests) {
    return false // blocked
  }

  record.count++
  return true // allowed
}

// Verify Razorpay webhook signature
export function verifyRazorpayWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  // Use timingSafeEqual to prevent timing attacks
  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (sigBuffer.length !== expectedBuffer.length) return false

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer)
}

// Sanitize text input — strip HTML tags and trim
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
    .slice(0, 2000)
}

// Validate Indian phone number
export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

// Validate pincode
export function validatePincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode)
}

// Validate email
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 255
}

// Check honeypot field — returns true if bot detected
export function isBot(honeypotValue: string): boolean {
  return honeypotValue !== ''
}

// Get IP from request headers safely
export function getClientIP(request: Request): string {
  const cfIP = request.headers.get('cf-connecting-ip')
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  // Cloudflare header is most trustworthy when behind Cloudflare
  return cfIP || forwardedFor?.split(',')[0].trim() || realIP || 'unknown'
}

/**
 * Log security event to Supabase for auditing and anomaly detection.
 */
export async function logSecurityEvent(
  event: 'rate_limit' | 'honeypot_hit' | 'invalid_webhook' | 'unauthorized_admin_access',
  details: { ip: string; path: string; data?: any }
) {
  try {
    const { createClient } = await import('./supabase/server')
    const supabase = await createClient()
    
    await supabase.from('security_logs').insert({
      event_type: event,
      ip_address: details.ip,
      path: details.path,
      metadata: details.data,
    })

    console.warn(`[SECURITY] ${event.toUpperCase()} detected from ${details.ip} on ${details.path}`)
  } catch (err) {
    console.error('Failed to log security event:', err)
  }
}
