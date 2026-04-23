'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)
  const { settings } = useTheme()
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (!error) setProducts(data || [])
      setLoading(false)
    }

    fetchProducts()
  }, [category, supabase])

  const getGridClass = () => {
    if (settings.shop.isMasonry) return 'columns-1 md:columns-2 lg:columns-' + settings.shop.columns + ' gap-x-6 md:gap-x-12 space-y-12 md:space-y-20'
    const colClass = settings.shop.columns === 2 ? 'lg:grid-cols-2' : settings.shop.columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
    return `grid grid-cols-2 ${colClass} gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-20`
  }

  const getFilterClass = (isActive: boolean) => {
    const base = 'transition-colors '
    if (settings.shop.filterStyle === 'pills') {
      return base + (isActive ? 'bg-[var(--color-brand-red)] text-white px-4 py-2 rounded-[var(--radius-full)] font-bold' : 'bg-gray-100 text-gray-400 px-4 py-2 rounded-[var(--radius-full)] hover:bg-gray-200')
    }
    if (settings.shop.filterStyle === 'tabs') {
      return base + (isActive ? 'border-b-2 border-[var(--color-brand-red)] text-[var(--color-brand-red)] font-bold pb-2' : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600 pb-2')
    }
    // minimal
    return base + (isActive ? 'text-[var(--color-brand-red)] font-bold' : 'text-gray-400 hover:text-gray-900')
  }

  return (
    <main className="min-h-screen pt-48 px-8 md:px-16 pb-24 transition-colors duration-500" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Navbar />
      
      <header className={`mb-24 space-y-10 ${settings.shop.titleAlign === 'center' ? 'text-center flex flex-col items-center' : 'text-left'}`}>
        <h1 className="text-6xl md:text-8xl font-light text-[var(--color-brand-red)] italic tracking-tighter transition-colors">
          The Collection
        </h1>
        
        <div className={`flex flex-wrap gap-x-12 gap-y-4 text-[10px] uppercase tracking-[0.4em] ${settings.shop.filterStyle === 'minimal' ? 'border-b border-gray-200 pb-8' : ''} ${settings.shop.titleAlign === 'center' ? 'justify-center mx-auto' : ''}`}>
          <button 
            onClick={() => setCategory(null)}
            className={getFilterClass(category === null)}
          >
            All Pieces
          </button>
          <button 
            onClick={() => setCategory('crochet')}
            className={getFilterClass(category === 'crochet')}
          >
            Crochet
          </button>
          <button 
            onClick={() => setCategory('polaroid')}
            className={getFilterClass(category === 'polaroid')}
          >
            Polaroids
          </button>
        </div>
      </header>

      {loading ? (
        <div className={getGridClass() + ' animate-pulse'}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`space-y-4 ${settings.shop.isMasonry ? 'break-inside-avoid' : ''}`}>
              <div className="aspect-[4/5] bg-gray-100 rounded-[var(--radius-sm)]" />
              <div className="h-4 bg-gray-100 w-2/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="font-serif italic text-2xl text-gray-400">The shelf is empty for a moment.</p>
          <button onClick={() => setCategory(null)} className="text-[10px] uppercase tracking-widest text-[var(--color-brand-red)] hover:opacity-80">View all items</button>
        </div>
      ) : (
        <div className={getGridClass()}>
          {products.map(product => (
            <div key={product.id} className={settings.shop.isMasonry ? 'break-inside-avoid' : ''}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
