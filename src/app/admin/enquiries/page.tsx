'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/AdminLayout'

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
    <AdminLayout activeTab="enquiries">
      <header className="border-b border-gray-100 pb-12">
        <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Dialogues.</h1>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium mt-4">{enquiries.length} Voices Heard</p>
      </header>

      <section className="grid grid-cols-1 gap-12">
        {loading ? (
          <div className="py-24 text-center text-[10px] uppercase tracking-[1em] text-gray-300 animate-pulse italic">Connecting the threads...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-24 text-center space-y-4">
            <p className="text-gray-200 text-6xl font-serif italic opacity-50">Silence.</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">No entries in the dialogue yet</p>
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white p-12 rounded-sm shadow-sm border border-gray-100 flex flex-col space-y-8 group hover:shadow-xl transition-all duration-700">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Conversation From</p>
                  <h3 className="text-3xl font-serif italic text-brand-dark">{enquiry.name}</h3>
                  <a href={`mailto:${enquiry.email}`} className="text-sm text-gray-400 hover:text-brand-red transition-colors">{enquiry.email}</a>
                </div>
                <div className="flex gap-6 items-center">
                  {enquiry.is_custom_order && (
                    <span className="bg-brand-red text-brand-cream text-[8px] uppercase tracking-[0.3em] font-black px-4 py-2 rounded-full shadow-lg shadow-brand-red/20">
                      Private Commission
                    </span>
                  )}
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">
                    {new Date(enquiry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2025' })}
                  </p>
                </div>
              </div>

              <div className="text-lg text-gray-600 leading-relaxed italic font-light border-l-4 border-brand-red/5 pl-10 py-2">
                "{enquiry.message}"
              </div>

              <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                <a 
                  href={`mailto:${enquiry.email}?subject=Re: Your Ilaara Enquiry`}
                  className="px-8 py-3 bg-brand-dark text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-red transition-all"
                >
                  Draft Response →
                </a>
                <button 
                  onClick={async () => {
                    if (confirm('Once deleted, this story is lost forever.')) {
                      const { error } = await supabase.from('enquiries').delete().eq('id', enquiry.id)
                      if (!error) fetchEnquiries()
                    }
                  }}
                  className="text-[10px] uppercase tracking-widest text-gray-200 hover:text-red-500 transition-colors font-black"
                >
                  Discard Record
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </AdminLayout>
  )
}
  )
}
