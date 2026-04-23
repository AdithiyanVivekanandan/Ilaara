'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/components/CartProvider'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)
  
  const supabase = createClient()
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (!error) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [slug, supabase])

  const handleAddToCart = () => {
    if (!product) return
    setAdding(true)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]
    })
    setTimeout(() => setAdding(false), 1000)
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-cream animate-pulse pt-32 px-8 md:px-16">
      <Navbar />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="aspect-[4/5] bg-gray-200" />
        <div className="space-y-8">
          <div className="h-10 bg-gray-200 w-2/3" />
          <div className="h-4 bg-gray-200 w-1/4" />
          <div className="h-32 bg-gray-200" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <Navbar />
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif italic text-gray-400">Lost in the threads.</h1>
        <p className="text-[10px] uppercase tracking-widest">Product not found</p>
        <a href="/shop" className="block text-brand-red uppercase tracking-widest text-[10px] font-bold">Back to Shop</a>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-brand-cream pt-32 px-8 md:px-16 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-white rounded-sm overflow-hidden shadow-sm">
            {product.images?.[activeImage] && (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
            {!product.is_available && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-brand-red text-brand-cream text-xs uppercase tracking-[0.3em] px-8 py-2 rounded-full font-bold">
                  Sold Out
                </span>
              </div>
            )}
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 aspect-square overflow-hidden rounded-sm border-2 transition-colors ${activeImage === i ? 'border-brand-red' : 'border-transparent'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-12 py-4">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
              {product.category}
            </p>
            <h1 className="text-5xl md:text-7xl font-light text-brand-dark leading-tight italic font-serif">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-gray-600">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="prose prose-sm prose-gray max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="pt-8 space-y-6">
            {product.is_available ? (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`w-full py-5 rounded-full text-xs uppercase tracking-[0.3em] font-bold transition-all duration-500 shadow-lg ${
                  adding 
                  ? 'bg-green-600 text-white scale-[0.98]' 
                  : 'bg-brand-red text-brand-cream hover:bg-brand-dark'
                }`}
              >
                {adding ? 'Added to Cart' : 'Add to Collection'}
              </button>
            ) : (
              <button disabled className="w-full py-5 border-2 border-gray-200 text-gray-300 rounded-full text-xs uppercase tracking-[0.3em] cursor-not-allowed">
                Waitlist Only
              </button>
            )}
            
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
              Standard delivery in 5-7 business days.
            </p>
          </div>
          
          <div className="pt-12 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Handmade with care</span>
            <div className="flex gap-4">
              {/* Social links placeholder */}
              <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300">
                <span className="text-[8px]">IG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
