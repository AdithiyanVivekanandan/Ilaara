import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIP, sanitizeText, validateEmail, validatePhone, validatePincode, isBot, logSecurityEvent } from '@/lib/security'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const ip = getClientIP(request)

  // Strict rate limit on checkout — max 5 per minute per IP
  if (!rateLimit(ip, 5, 60000)) {
    await logSecurityEvent('rate_limit', { ip, path: '/api/checkout' })
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()

  // Honeypot check
  if (isBot(body.website || '')) {
    await logSecurityEvent('honeypot_hit', { ip, path: '/api/checkout', data: { body } })
    // Return 200 to not tip off the bot but don't process
    return NextResponse.json({ success: true })
  }

  // Validate all inputs
  const { buyerName, buyerEmail, buyerPhone, shippingAddress, items } = body

  if (!buyerName || sanitizeText(buyerName).length < 2) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (!validateEmail(buyerEmail)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!validatePhone(buyerPhone)) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
  }
  if (!validatePincode(shippingAddress?.pincode)) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 })
  }

  // Verify prices server-side — never trust client-sent prices
  const supabase = await createClient()
  const productIds = items.map((i: any) => i.product_id)

  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, price, is_available')
    .in('id', productIds)

  if (productError || !products) {
    return NextResponse.json({ error: 'Failed to verify products' }, { status: 500 })
  }

  // Check all products are available and calculate real total
  let totalAmount = 0
  const verifiedItems = []

  for (const item of items) {
    const product = products.find(p => p.id === item.product_id)
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 400 })
    }
    if (!product.is_available) {
      return NextResponse.json({ error: `${product.name} is no longer available` }, { status: 400 })
    }
    const quantity = Math.max(1, Math.min(10, parseInt(item.quantity) || 1))
    totalAmount += product.price * quantity
    verifiedItems.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    })
  }

  try {
    const whatsappNumber = process.env.CLIENT_WHATSAPP_NUMBER
    if (!whatsappNumber) {
      return NextResponse.json({ error: 'WhatsApp configuration missing' }, { status: 500 })
    }

    const encodedPhone = whatsappNumber.replace(/\D/g, '')
    const messageLines = [
      'New Ilaara order received!',
      `Name: ${sanitizeText(buyerName)}`,
      `Email: ${buyerEmail.toLowerCase().trim()}`,
      `Phone: ${buyerPhone.replace(/\s/g, '')}`,
      `Address: ${sanitizeText(shippingAddress.line1)}, ${sanitizeText(shippingAddress.city)}, ${sanitizeText(shippingAddress.state)} - ${shippingAddress.pincode}`,
      'Items:',
      ...verifiedItems.map(item => `• ${item.name} ×${item.quantity} @ ₹${item.price}`),
      `Total: ₹${totalAmount.toLocaleString('en-IN')}`,
    ]

    if (shippingAddress.customRequest) {
      messageLines.push(`Custom request: ${sanitizeText(shippingAddress.customRequest)}`)
    }

    const whatsappUrl = `https://wa.me/${encodedPhone}?text=${encodeURIComponent(messageLines.join('\n'))}`

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_name: sanitizeText(buyerName),
        buyer_email: buyerEmail.toLowerCase().trim(),
        buyer_phone: buyerPhone.replace(/\s/g, ''),
        shipping_address: {
          line1: sanitizeText(shippingAddress.line1),
          city: sanitizeText(shippingAddress.city),
          state: sanitizeText(shippingAddress.state),
          pincode: shippingAddress.pincode,
          custom_request: sanitizeText(shippingAddress.customRequest || ''),
        },
        items: verifiedItems,
        total_amount: totalAmount,
        status: 'sent',
      })
      .select('id')
      .single()

    if (orderError) {
      throw orderError
    }

    return NextResponse.json({
      whatsappUrl,
      internalOrderId: order.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
