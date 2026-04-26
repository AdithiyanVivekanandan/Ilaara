'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { settings } = useTheme()

  useLayoutEffect(() => {
    if (!containerRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 2. Initial Animation
      gsap.from('.hero-content', { 
        opacity: 0, 
        y: 20, 
        duration: 1.5, 
        ease: 'power3.out' 
      })

      // 3. MAIN SCROLL TIMELINE
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${400 * settings.home.scrollSpeed}%`, // Dynamic scroll speed
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      })

      // Hero Elements Exit
      mainTl.to('.hero-scene', { 
        opacity: 0, 
        y: -100 * settings.home.parallaxIntensity, 
        duration: 1 
      })

      // Parallax Art
      mainTl.to('.float-art-left', { x: -100 * settings.home.parallaxIntensity, y: -50, rotate: -10, duration: 2 }, 0)
      mainTl.to('.float-art-right', { x: 100 * settings.home.parallaxIntensity, y: -80, rotate: 10, duration: 2 }, 0)

      settings.home.stories.forEach((story, index) => {
        const isFirst = index === 0
        const isLast = index === settings.home.stories.length - 1
        const sectionClass = `.chapter-${index + 1}`

        if (!isFirst) {
          mainTl.fromTo(sectionClass, 
            { opacity: 0, x: 100 * settings.home.parallaxIntensity }, 
            { opacity: 1, x: 0, duration: 1.5 }, 
            '-=0.5'
          )
        } else {
          mainTl.fromTo(sectionClass, 
            { opacity: 0, y: 100 * settings.home.parallaxIntensity, scale: 0.95 }, 
            { opacity: 1, y: 0, scale: 1, duration: 1.5 }, 
            '-=0.5'
          )
        }

        if (!isLast || true) { // Always exit to show CTA
          mainTl.to(sectionClass, { opacity: 0, x: -100 * settings.home.parallaxIntensity, duration: 1 }, '+=1')
        }
      })

      // Final CTA
      mainTl.fromTo('.cta-scene', 
        { opacity: 0, y: 50 * settings.home.parallaxIntensity }, 
        { opacity: 1, y: 0, duration: 1.2 }, 
        '-=0.5'
      )

    }, containerRef)

    return () => ctx.revert()
  }, [settings.home.scrollSpeed, settings.home.parallaxIntensity, settings.home.stories.length])

  return (
    <main className="relative min-h-screen select-none overflow-hidden" ref={containerRef}>
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-[var(--color-secondary)] opacity-80" />
        <div className="float-art-left absolute top-1/4 left-[5%] w-64 md:w-[28rem] aspect-square opacity-20 grayscale mix-blend-soft-light">
          <Image src="/crochet.png" alt="" fill className="object-contain" loading="eager" />
        </div>
        <div className="float-art-right absolute top-1/3 right-[5%] w-72 md:w-[32rem] aspect-square opacity-20 grayscale mix-blend-soft-light">
          <Image src="/polaroid.png" alt="" fill className="object-contain" loading="eager" />
        </div>
      </div>

      <div className="relative z-10 w-full h-screen">
        
        {/* SCENE 1: INITIAL HERO */}
        <section className="hero-scene bg-gradient-to-br from-[var(--bg-color)] via-white/92 to-[var(--color-secondary)] h-full flex flex-col items-center justify-center px-6 md:px-16 relative overflow-hidden" style={{ transform: `scale(${settings.home.logoSize})` }}>
          <div className="hero-content relative z-20 rounded-[var(--radius-sm)] bg-white/85 backdrop-blur-sm px-8 py-10 md:px-14 md:py-14 shadow-2xl text-center space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <h1 className="spaced-serif text-5xl md:text-8xl lg:text-[14rem] text-[var(--color-brand-red)] tracking-[0.3em] md:tracking-[0.5em] leading-none transition-all">
                {settings.home.hero_title}
              </h1>
              <p className="text-[8px] md:text-sm uppercase tracking-[0.6em] md:tracking-[1em] text-gray-400 font-bold opacity-60">
                {settings.home.hero_subtitle}
              </p>
            </div>
            
            <div className="pt-16 md:pt-48">
              <Link 
                href="/shop" 
                className="px-12 md:px-20 py-6 md:py-8 bg-[var(--color-brand-red)] text-white text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black rounded-[var(--radius-full)] hover:opacity-80 hover:scale-105 transition-all shadow-2xl active:scale-95 pointer-events-auto"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-20">
            <div className="w-[1px] h-10 md:h-12 bg-[var(--color-brand-red)] animate-scroll-line" />
            <span className="text-[7px] uppercase tracking-widest text-[var(--color-brand-red)]">Scroll</span>
          </div>
        </section>

        {/* DYNAMIC STORIES */}
        {settings.home.stories.map((story, index) => (
          <section key={index} className={`chapter-${index + 1} absolute inset-0 opacity-0 flex flex-col items-center justify-center px-6 md:px-32 bg-[var(--bg-color)]`}>
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className={`relative aspect-square shadow-2xl rounded-[var(--radius-sm)] p-8 md:p-12 bg-white overflow-hidden group ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                {story.image && <Image src={story.image} alt={story.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" priority={index === 0} />}
              </div>
              <div className={`space-y-6 md:space-y-10 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] text-[var(--color-brand-red)] font-black">Story 0{index + 1}</span>
                <h3 className="text-4xl md:text-8xl font-light italic font-serif leading-none tracking-tight text-gray-900">{story.title}</h3>
                <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed max-w-sm">
                  {story.body}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* FINAL CTA */}
        <section className="cta-scene absolute inset-0 opacity-0 flex flex-col items-center justify-center px-6 bg-[var(--bg-color)]">
          <div className="text-center space-y-8 md:space-y-16">
            <h2 className="text-4xl md:text-9xl font-light italic font-serif text-gray-900 opacity-10 tracking-tighter leading-none">
              Honest craft, <br /> slowly made.
            </h2>
            <Link 
              href="/shop" 
              className="inline-block px-12 md:px-20 py-6 md:py-8 bg-[var(--color-brand-red)] text-white text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-black rounded-[var(--radius-full)] hover:opacity-80 transition-all scale-105 md:scale-110 pointer-events-auto"
            >
              Enter the Shop
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
