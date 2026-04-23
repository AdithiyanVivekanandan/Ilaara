'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/router'
import { usePathname } from 'next/navigation'

/**
 * Shared Admin Sidebar Component
 */
function Sidebar({ activeTab }: { activeTab: string }) {
  const navLinks = [
    { label: 'Overview', href: '/admin', id: 'dashboard' },
    { label: 'Inventory', href: '/admin/products', id: 'products' },
    { label: 'Activity', href: '/admin/orders', id: 'orders' },
    { label: 'Messages', href: '/admin/enquiries', id: 'enquiries' },
  ]

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
      <div className="p-10">
        <a href="/" className="spaced-serif text-2xl font-bold text-brand-red tracking-[0.4em]">ILAARA</a>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">System Live</span>
        </div>
      </div>
      
      <nav className="flex-grow px-6 space-y-1">
        {navLinks.map((link) => (
          <a 
            key={link.id}
            href={link.href} 
            className={`flex items-center px-6 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all group ${
              activeTab === link.id 
              ? 'bg-brand-red text-brand-cream shadow-lg shadow-brand-red/20' 
              : 'text-gray-400 hover:text-brand-red hover:bg-brand-red/5'
            }`}
          >
            {link.label}
            {activeTab !== link.id && <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
          </a>
        ))}
      </nav>

      <div className="p-10 border-t border-gray-50 flex flex-col gap-4">
        <div className="bg-brand-cream/50 p-4 rounded-sm border border-brand-red/5">
          <p className="text-[9px] uppercase tracking-widest text-gray-400">Security State</p>
          <p className="text-[10px] font-bold text-brand-red">Hardened</p>
        </div>
      </div>
    </aside>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category: 'crochet',
    images: [] as string[],
    is_available: true,
    is_featured: false,
    is_visible: true
  })
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form
      })
      const data = await res.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }))
      }
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = { ...formData, price: Number(formData.price) }

    let error
    if (editingProduct) {
      const { error: err } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id)
      error = err
    } else {
      const { error: err } = await supabase
        .from('products')
        .insert(payload)
      error = err
    }

    if (!error) {
      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        name: '', slug: '', description: '', price: 0,
        category: 'crochet', images: [], is_available: true, is_featured: false, is_visible: true
      })
      fetchProducts()
    } else {
      alert(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  const deleteProduct = async (product: any) => {
    if (!confirm('This will permanently delete the piece and all its images. Continue?')) return
    
    // 1. Delete from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const url of product.images) {
        await fetch('/api/upload/delete', {
          method: 'POST',
          body: JSON.stringify({ imageUrl: url })
        })
      }
    }

    // 2. Delete from Database
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (!error) fetchProducts()
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex font-sans selection:bg-brand-red selection:text-white">
      <Sidebar activeTab="products" />

      <main className="flex-grow ml-72 p-16 space-y-16">
        <header className="flex justify-between items-end border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Inventory.</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Collection Control • {products.length} Items Listed</p>
          </div>
          <button 
            onClick={() => { setShowForm(true); setEditingProduct(null); setFormData({
              name: '', slug: '', description: '', price: 0, category: 'crochet', images: [], is_available: true, is_featured: false, is_visible: true
            }) }}
            className="px-10 py-4 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all shadow-xl active:scale-95"
          >
            + Create New Piece
          </button>
        </header>

        {showForm && (
          <section className="bg-white p-12 rounded-sm shadow-2xl max-w-4xl border border-gray-100 relative">
            <header className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-serif italic text-brand-dark">{editingProduct ? 'Edit Narrative' : 'New Collection Member'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[10px] uppercase tracking-widest text-gray-300 hover:text-brand-red transition-colors">Dismiss</button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Title</label>
                  <input required placeholder="eg. The Midnight Tote" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm outline-none focus:border-brand-red transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Slug (Unique Link)</label>
                  <input required placeholder="midnight-tote" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm outline-none focus:border-brand-red transition-all" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Story</label>
                <textarea placeholder="Write the narrative for this piece..." rows={4} className="w-full bg-transparent border-b border-gray-100 py-3 text-sm outline-none focus:border-brand-red transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Price (INR)</label>
                  <input required type="number" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm outline-none focus:border-brand-red transition-all" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Category</label>
                  <select className="w-full bg-transparent border-b border-gray-100 py-3 text-sm outline-none focus:border-brand-red transition-all appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="crochet">Crochet</option>
                    <option value="polaroid">Polaroid</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-12 items-center py-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_visible" checked={formData.is_visible} onChange={e => setFormData({...formData, is_visible: e.target.checked})} className="accent-brand-red w-4 h-4" />
                  <label htmlFor="is_visible" className="text-[10px] uppercase tracking-widest text-brand-dark font-black">Show in Shop</label>
                </div>
                <div className="flex items-center gap-3">
                   <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="accent-brand-red w-4 h-4" />
                   <label htmlFor="is_featured" className="text-[10px] uppercase tracking-widest text-brand-dark font-black">Feature on Landing</label>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Visual Assets</label>
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((url, i) => (
                    <div key={i} className="w-24 h-24 bg-gray-50 rounded-sm relative group overflow-hidden border border-gray-100">
                      <img src={url} className="w-full h-full object-contain" />
                      <button type="button" onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-brand-red/90 text-brand-cream opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[8px] uppercase tracking-[0.3em] font-black">Remove</button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-brand-red hover:bg-brand-red/5 transition-all text-gray-300">
                    <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    <span className="text-2xl">+</span>
                    <span className="text-[8px] uppercase tracking-widest mt-1">Upload</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-gray-50">
                <button type="submit" disabled={loading} className="px-12 py-5 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all shadow-xl">{loading ? 'Processing...' : 'Save Piece to Collection'}</button>
              </div>
            </form>
          </section>
        )}

        {/* Product Table - Elevated Style */}
        <section className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-50">
                <th className="px-10 py-6 text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">The Piece</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Price</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Status</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Feature</th>
                <th className="px-10 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && !showForm ? (
                <tr><td colSpan={5} className="px-10 py-24 text-center text-[10px] uppercase tracking-[1em] text-gray-300 animate-pulse italic">Cataloging inventory...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-10 py-24 text-center text-gray-300 font-serif italic text-3xl opacity-50">No pieces in the library.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                          {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-contain" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-serif italic text-brand-dark group-hover:text-brand-red transition-colors">{p.name}</p>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-xl font-light text-brand-dark tracking-tighter">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-6">
                      <button onClick={async () => {
                        const { error } = await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id)
                        if (!error) fetchProducts()
                      }} className={`text-[9px] uppercase tracking-[0.4em] px-5 py-2 rounded-full font-black border transition-all ${
                        p.is_available 
                        ? 'border-green-100 text-green-700 bg-green-50' 
                        : 'border-red-100 text-brand-red bg-red-50'
                      }`}>
                        {p.is_available ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <button onClick={async () => {
                        const { error } = await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id)
                        if (!error) fetchProducts()
                      }} className={`text-xl transition-all ${p.is_featured ? 'text-brand-red scale-110' : 'text-gray-200 hover:text-brand-red opacity-40 hover:opacity-100'}`}>
                        ★
                      </button>
                    </td>
                    <td className="px-10 py-6 text-right space-x-8">
                      <button onClick={() => { setEditingProduct(p); setFormData(p); setShowForm(true); }} className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300 hover:text-brand-red transition-colors">Edit</button>
                      <button onClick={() => deleteProduct(p)} className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-100 hover:text-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
