'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function Sidebar({ activeTab }: { activeTab: string }) {
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const navLinks = [
    { label: 'Overview', href: '/admin', id: 'dashboard' },
    { label: 'Inventory', href: '/admin/products', id: 'products' },
    { label: 'Activity', href: '/admin/orders', id: 'orders' },
    { label: 'Messages', href: '/admin/enquiries', id: 'enquiries' },
    { label: 'Shield', href: '/admin/security', id: 'security' },
    { label: 'Customize', href: '/admin/customize', id: 'customize' },
    { label: 'Developer', href: '/dev', id: 'developer' },
  ]

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
      <div className="p-10">
        <Link href="/" className="spaced-serif text-2xl font-bold text-brand-red tracking-[0.4em]">ILAARA</Link>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">System Live</span>
        </div>
      </div>
      
      <nav className="flex-grow px-6 space-y-1">
        {navLinks.map((link) => (
          <Link 
            key={link.id}
            href={link.href} 
            className={`flex items-center px-6 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all group ${
              activeTab === link.id 
              ? 'bg-brand-red text-brand-cream shadow-lg shadow-brand-red/20' 
              : 'text-gray-400 hover:text-brand-red hover:bg-brand-red/5'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-10 border-t border-gray-50 flex flex-col gap-4">
        <div className="bg-brand-cream/50 p-4 rounded-sm border border-brand-red/5">
          <p className="text-[9px] uppercase tracking-widest text-gray-400">Security State</p>
          <p className="text-[10px] font-bold text-brand-red">Hardened</p>
        </div>
        <button
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true)
            await supabase.auth.signOut()
            router.push('/admin/login')
          }}
          className="w-full py-3 text-[10px] uppercase tracking-[0.4em] font-black rounded-full border border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-all disabled:opacity-50"
        >
          {signingOut ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children, activeTab }: { children: React.ReactNode, activeTab: string }) {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex font-sans selection:bg-brand-red selection:text-white">
      <Sidebar activeTab={activeTab} />
      <main className="flex-grow ml-72 p-8 md:p-16 space-y-16 relative z-10 transition-opacity duration-500 animate-in fade-in">
        {children}
      </main>
    </div>
  )
}
