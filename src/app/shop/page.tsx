'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/client'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)
  
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

  return (
    <main className="min-h-screen bg-brand-cream pt-48 px-8 md:px-16 pb-24">
      <Navbar />
      
      <header className="mb-24 space-y-10">
        <h1 className="text-6xl md:text-8xl font-light text-brand-red italic tracking-tighter">
          The Collection
        </h1>
        
        <div className="flex flex-wrap gap-x-12 gap-y-4 text-[10px] uppercase tracking-[0.4em] border-b border-brand-red/5 pb-8">
          <button 
            onClick={() => setCategory(null)}
            className={`transition-colors ${!category ? 'text-brand-red font-bold' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            All Pieces
          </button>
          <button 
            onClick={() => setCategory('crochet')}
            className={`transition-colors ${category === 'crochet' ? 'text-brand-red font-bold' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Crochet
          </button>
          <button 
            onClick={() => setCategory('polaroid')}
            className={`transition-colors ${category === 'polaroid' ? 'text-brand-red font-bold' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Polaroids
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-20 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-gray-100 rounded-sm" />
              <div className="h-4 bg-gray-100 w-2/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="font-serif italic text-2xl text-gray-400">The shelf is empty for a moment.</p>
          <button onClick={() => setCategory(null)} className="text-[10px] uppercase tracking-widest text-brand-red">View all items</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-20">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
