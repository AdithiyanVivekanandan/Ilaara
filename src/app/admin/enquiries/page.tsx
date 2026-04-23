'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchEnquiries()
  }, [])

  async function fetchEnquiries() {
    setLoading(true)
    const { data } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
    setEnquiries(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Same as Dashboard */}
      <aside className="w-64 bg-brand-dark text-brand-cream flex flex-col">
        <div className="p-8">
          <h2 className="spaced-serif text-xl font-bold">ILAARA</h2>
          <p className="text-[8px] uppercase tracking-widest opacity-40 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Dashboard</Link>
          <Link href="/admin/products" className="block px-4 py-3 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Products</Link>
          <Link href="/admin/orders" className="block px-4 py-3 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Orders</Link>
          <Link href="/admin/enquiries" className="block px-4 py-3 bg-brand-red rounded-sm text-xs uppercase tracking-widest font-bold">Enquiries</Link>
        </nav>
      </aside>

      <main className="flex-grow p-12 space-y-8">
        <header>
          <h1 className="text-4xl font-serif italic text-brand-dark">Enquiries</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">{enquiries.length} stories shared</p>
        </header>

        <section className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-24 text-center text-xs text-gray-400 animate-pulse italic">Connecting the threads...</div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white p-24 text-center rounded-sm shadow-sm border border-gray-100">
              <p className="text-gray-400 italic font-serif text-lg">Silence. No messages yet.</p>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white p-10 rounded-sm shadow-sm border border-gray-50 flex flex-col space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">From</p>
                    <h3 className="text-xl font-medium">{enquiry.name}</h3>
                    <a href={`mailto:${enquiry.email}`} className="text-sm text-brand-red hover:underline">{enquiry.email}</a>
                  </div>
                  <div className="flex gap-4 items-center">
                    {enquiry.is_custom_order && (
                      <span className="bg-brand-red/10 text-brand-red text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-brand-red/20">
                        Custom Request
                      </span>
                    )}
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">
                      {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="prose prose-sm prose-gray max-w-none border-l-2 border-gray-50 pl-8 leading-relaxed italic text-gray-600">
                  {enquiry.message}
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <a 
                    href={`mailto:${enquiry.email}?subject=Re: Your Ilaara Enquiry`}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-red hover:text-brand-dark transition-colors"
                  >
                    Reply via Email →
                  </a>
                  <button 
                    onClick={async () => {
                      if (confirm('Once deleted, this story is lost forever.')) {
                        const { error } = await supabase.from('enquiries').delete().eq('id', enquiry.id)
                        if (!error) fetchEnquiries()
                      }
                    }}
                    className="text-[10px] uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}
