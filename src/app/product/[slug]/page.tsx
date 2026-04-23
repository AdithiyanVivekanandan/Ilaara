'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/components/CartProvider'
import { useTheme } from '@/components/ThemeProvider'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  
  const supabase = createClient()
  const { addToCart } = useCart()
  const { settings } = useTheme()

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
      quantity: quantity,
      image: product.images?.[0]
    })
    setTimeout(() => setAdding(false), 1000)
  }

  const getCtaClass = () => {
    let base = `py-5 text-xs uppercase tracking-[0.3em] font-bold transition-all duration-500 shadow-lg `
    base += settings.product.ctaStyle === 'full' ? 'w-full ' : 'px-8 flex-grow '
    
    if (adding) {
      return base + 'bg-green-600 text-white scale-[0.98]'
    }

    if (settings.product.ctaStyle === 'outlined') {
      return base + `border-2 border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white rounded-[var(--radius-full)]`
    }

    return base + `bg-[var(--color-brand-red)] text-white hover:opacity-80 rounded-[var(--radius-full)]`
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-color)] animate-pulse pt-32 px-8 md:px-16" style={{ backgroundColor: 'var(--bg-color)' }}>
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
      <Navbar />
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif italic text-gray-400">Lost in the threads.</h1>
        <p className="text-[10px] uppercase tracking-widest">Product not found</p>
        <Link href="/shop" className="block text-[var(--color-brand-red)] uppercase tracking-widest text-[10px] font-bold">Back to Shop</Link>
      </div>
    </div>
  )

  const features = [
    { icon: '🧶', label: 'Artisanal Craft', detail: 'Hand-woven with slow intention' },
    { icon: '🌿', label: 'Pure Material', detail: 'Sustainably sourced premium threads' },
    { icon: '✨', label: 'One of One', detail: 'Every piece has a unique character' },
  ]

  return (
    <main className="min-h-screen bg-[var(--bg-color)] pt-32 px-8 md:px-16 pb-24 transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {settings.product.showBreadcrumbs && (
          <div className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
            <Link href="/shop" className="hover:text-[var(--color-brand-red)] transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-brand-red)]">{product.name}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Layout: Gallery Styles */}
          {settings.product.galleryStyle === 'stacked' ? (
             <div className="space-y-8 flex flex-col">
               {product.images?.map((img: string, i: number) => (
                 <div key={i} className="relative aspect-[4/5] bg-white rounded-[var(--radius-sm)] overflow-hidden shadow-sm">
                   <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                 </div>
               ))}
               {!product.is_available && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-[var(--color-brand-red)] text-white text-xs uppercase tracking-[0.3em] px-8 py-2 rounded-[var(--radius-full)] font-bold">Sold Out</span>
                  </div>
                )}
             </div>
          ) : (
            <div className="space-y-4 sticky top-32">
              <div className="relative aspect-[4/5] bg-white rounded-[var(--radius-sm)] overflow-hidden shadow-sm">
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
                    <span className="bg-[var(--color-brand-red)] text-white text-xs uppercase tracking-[0.3em] px-8 py-2 rounded-[var(--radius-full)] font-bold">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
              
              {settings.product.galleryStyle === 'thumbnails' && product.images?.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 aspect-square overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors ${activeImage === i ? 'border-[var(--color-brand-red)]' : 'border-transparent'}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="space-y-12 py-4">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
                {product.category}
              </p>
              <h1 className={`text-5xl md:text-7xl font-light text-gray-900 leading-tight italic font-serif`}>
                {product.name}
              </h1>
              <p className={`text-2xl font-light text-gray-600`}>
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="prose prose-sm prose-gray max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Key Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-gray-200">
              {features.map((f, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-xl">{f.icon}</span>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-900">{f.label}</p>
                  <p className="text-[9px] text-gray-400 leading-tight uppercase tracking-tighter">{f.detail}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-8">
              {product.is_available ? (
                <div className={`flex gap-4 ${settings.product.ctaStyle === 'full' ? 'flex-col' : 'flex-row'}`}>
                  <div className="flex items-center border border-gray-300 rounded-[var(--radius-full)] overflow-hidden h-16 w-max max-w-full">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-6 h-full hover:bg-[var(--color-brand-red)] hover:text-white transition-colors">−</button>
                    <span className="px-6 font-bold text-sm min-w-[3rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-6 h-full hover:bg-[var(--color-brand-red)] hover:text-white transition-colors">+</button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className={getCtaClass()}
                  >
                    {adding ? 'Added to Cart' : 'Add to Collection'}
                  </button>
                </div>
              ) : (
                <button disabled className="w-full py-5 border-2 border-gray-300 text-gray-400 rounded-[var(--radius-full)] text-xs uppercase tracking-[0.3em] cursor-not-allowed">
                  Waitlist Only
                </button>
              )}
              
              <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest italic">
                Every Ilaara piece is uniquely numbered.
              </p>
            </div>
            
            <div className="pt-12 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Handmade with care</span>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {settings.product.showRelated && (
          <div className="pt-32 space-y-12">
            <h3 className="text-3xl font-serif italic text-gray-900 text-center">You might also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 pointer-events-none">
              {/* Note: In a real app we'd fetch actual related products. Placeholder for visuals. */}
              {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-[4/5] bg-gray-200 rounded-[var(--radius-sm)] animate-pulse" />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
