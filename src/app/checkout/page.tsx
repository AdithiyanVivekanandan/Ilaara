'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { useCart } from '@/components/CartProvider'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
    customRequest: '',
    website: '' // Honeypot field
  })

  if (items.length === 0) {
    if (typeof window !== 'undefined') router.push('/shop')
    return null
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          shippingAddress: {
            line1: formData.line1,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            customRequest: formData.customRequest,
          },
          items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
          website: formData.website // Honeypot check
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order submission failed')

      clearCart()
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer')
      }
      router.push(`/success?order=${data.internalOrderId}`)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream pt-32 px-8 md:px-16 pb-24">
      <Navbar />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        {/* Form */}
        <section className="space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl font-serif italic text-brand-red">Shipping Details</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Where should we send your pieces?</p>
          </header>

          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <input 
                type="text" 
                name="website" 
                value={formData.website} 
                onChange={(e) => setFormData({...formData, website: e.target.value})} 
                tabIndex={-1} 
                autoComplete="off" 
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <input
                required
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input
                  required
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <input
                required
                placeholder="Shipping Address (Line 1)"
                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                value={formData.line1}
                onChange={e => setFormData({...formData, line1: e.target.value})}
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  required
                  placeholder="City"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
                <input
                  required
                  placeholder="State"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                />
                <input
                  required
                  placeholder="Pincode"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                  value={formData.pincode}
                  onChange={e => setFormData({...formData, pincode: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">Custom Request</label>
              <textarea
                placeholder="Any custom requests, sizing notes or details for your order"
                className="w-full min-h-[120px] bg-transparent border border-gray-200 rounded-sm p-4 text-sm focus:border-brand-red outline-none transition-colors"
                value={formData.customRequest}
                onChange={e => setFormData({...formData, customRequest: e.target.value})}
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-5 bg-brand-red text-brand-cream text-xs uppercase tracking-[0.3em] font-bold rounded-full hover:bg-brand-dark transition-all disabled:opacity-50 shadow-xl"
            >
              {loading ? 'Processing...' : 'Send Order via WhatsApp'}
            </button>
          </form>
        </section>

        {/* Order Summary */}
        <section className="bg-white p-12 rounded-sm shadow-sm h-fit space-y-8">
          <h2 className="text-xl font-serif italic text-brand-dark border-b border-gray-50 pb-6">Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
            <span className="text-sm uppercase tracking-widest font-bold">Total</span>
            <span className="text-2xl font-light">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-gray-400 italic leading-relaxed text-center">
            Payments are secured by Razorpay. <br /> You will be redirected to their secure portal.
          </p>
        </section>
      </div>
    </main>
  )
}
