'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ArtStreaks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const streaks = containerRef.current.querySelectorAll('.streak')
    
    streaks.forEach((streak, i) => {
      gsap.set(streak, {
        xPercent: -100 * (i % 2 === 0 ? 1 : -1),
        y: Math.random() * 100 + '%',
        opacity: 0,
        scaleX: 0.5 + Math.random()
      })

      gsap.to(streak, {
        xPercent: 100 * (i % 2 === 0 ? 1 : -1),
        opacity: 0.3,
        duration: 20 + Math.random() * 40,
        repeat: -1,
        ease: 'none',
        delay: i * 5
      })
    })
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-50">
      <div className="streak absolute w-full h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent blur-[1px]" style={{ top: '15%' }} />
      <div className="streak absolute w-full h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent blur-[2px]" style={{ top: '45%' }} />
      <div className="streak absolute w-full h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent blur-[1px]" style={{ top: '75%' }} />
      <div className="streak absolute w-full h-[3px] bg-gradient-to-r from-transparent via-brand-red to-transparent blur-[3px]" style={{ top: '30%' }} />
      <div className="streak absolute w-full h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent blur-[1px]" style={{ top: '85%' }} />
    </div>
  )
}
