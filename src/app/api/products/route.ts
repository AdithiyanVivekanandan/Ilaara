import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIP } from '@/lib/security'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const ip = getClientIP(request)

  // Rate limit public listings — max 60 per minute per IP
  if (!rateLimit(ip, 60, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('id, name, slug, price, category, images, is_featured, is_available')
    .order('created_at', { ascending: false })

  if (category && ['crochet', 'polaroid'].includes(category)) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }

  // Cache for 60 seconds at Cloudflare edge
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  })
}
