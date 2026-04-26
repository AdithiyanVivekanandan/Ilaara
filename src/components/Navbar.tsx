'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { settings } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getLinkClasses = (isActive: boolean) => {
    const base = 'text-[11px] uppercase tracking-[0.4em] font-bold transition-all pointer-events-auto '
    const active = isActive ? 'text-brand-red ' : 'text-brand-dark opacity-40 hover:opacity-100 '
    
    if (settings.home.navStyle === 'underline') {
      return base + active + (isActive ? 'border-b-2 border-brand-red pb-1' : '')
    }
    if (settings.home.navStyle === 'pill') {
      return base + active + (isActive ? 'bg-brand-red text-white px-4 py-2 rounded-full !opacity-100 ' : 'px-4 py-2 ')
    }
    return base + active
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] py-6 md:py-8 px-6 md:px-24 flex justify-between items-center pointer-events-auto transition-all duration-500 ${
      scrolled ? 'glass-nav shadow-2xl' : ''
    }`}>
      <Link 
        href="/" 
        className={`spaced-serif text-brand-red font-bold tracking-[0.3em] md:tracking-[0.5em] hover:opacity-100 transition-all duration-500 pointer-events-auto ${
          scrolled ? 'text-lg md:text-xl' : 'text-lg md:text-2xl'
        }`}
      >
        {settings.home.hero_title || 'ILAARA'}
      </Link>

      <div className={`flex gap-8 md:gap-12 items-center pointer-events-auto transition-all duration-500 rounded-full ${
        scrolled ? 'px-10 py-3' : 'px-0 py-0'
      }`}>
        <Link 
          href="/shop" 
          className={getLinkClasses(pathname === '/shop')}
        >
          Shop
        </Link>
        <Link 
          href="/contact" 
          className={getLinkClasses(pathname === '/contact')}
        >
          Story
        </Link>
        <Link 
          href="/cart" 
          className="relative text-brand-dark opacity-40 hover:opacity-100 transition-opacity pointer-events-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </Link>
      </div>
    </nav>
  )
}
