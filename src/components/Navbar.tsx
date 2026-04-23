'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] py-6 md:py-8 px-6 md:px-24 flex justify-between items-center transition-all duration-700 ${scrolled ? 'glass-nav' : 'bg-transparent'}`}>
      <Link 
        href="/" 
        className="spaced-serif text-brand-red text-lg md:text-2xl font-bold tracking-[0.3em] md:tracking-[0.5em] hover:opacity-100 transition-opacity pointer-events-auto"
      >
        ILAARA
      </Link>

      <div className="flex gap-12 items-center pointer-events-auto">
        <Link 
          href="/shop" 
          className={`text-[11px] uppercase tracking-[0.4em] font-bold transition-all ${pathname === '/shop' ? 'text-brand-red' : 'text-brand-dark opacity-40 hover:opacity-100'}`}
        >
          Shop
        </Link>
        <Link 
          href="/contact" 
          className={`text-[11px] uppercase tracking-[0.4em] font-bold transition-all ${pathname === '/contact' ? 'text-brand-red' : 'text-brand-dark opacity-40 hover:opacity-100'}`}
        >
          Story
        </Link>
        <Link 
          href="/cart" 
          className="relative text-brand-dark opacity-40 hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </Link>
      </div>
    </nav>
  )
}
