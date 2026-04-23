'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Ilaara Landing Page
 * Features a high-fidelity scrollytelling experience.
 */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // 1. Mount Check: Prevent hydration errors by ensuring code runs on client
    if (!containerRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 2. Initial Animation (Fade in non-parallax elements)
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
          end: '+=400%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      })

      // Hero Elements Exit
      mainTl.to('.hero-scene', { 
        opacity: 0, 
        y: -100, 
        duration: 1 
      })

      // Parallax Art (Background hand-drawn drawings)
      mainTl.to('.float-art-left', { x: -100, y: -50, rotate: -10, duration: 2 }, 0)
      mainTl.to('.float-art-right', { x: 100, y: -80, rotate: 10, duration: 2 }, 0)

      // Chapter 1 Entrance
      mainTl.fromTo('.chapter-1', 
        { opacity: 0, y: 100, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.5 }, 
        '-=0.5'
      )

      // Chapter 1 Exit -> Chapter 2 Entrance
      mainTl.to('.chapter-1', { opacity: 0, x: -100, duration: 1 }, '+=1')
      mainTl.fromTo('.chapter-2', 
        { opacity: 0, x: 100 }, 
        { opacity: 1, x: 0, duration: 1.5 }, 
        '-=0.5'
      )

      // Final CTA
      mainTl.to('.chapter-2', { opacity: 0, scale: 0.9, duration: 1 }, '+=1')
      mainTl.fromTo('.cta-scene', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.2 }, 
        '-=0.5'
      )

    }, containerRef)

    // 4. Cleanup: Critical for preventing memory leaks and hydration nodes mismatch
    return () => ctx.revert()
  }, [])

  return (
    <main className="relative bg-brand-cream min-h-screen select-none overflow-hidden" ref={containerRef}>
      <Navbar />

      {/* Floating 2D Hand-drawn Art (Persistent and Parallax) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="float-art-left absolute top-1/4 left-[5%] w-64 md:w-[28rem] aspect-square opacity-[0.07] grayscale">
          <Image src="/crochet.png" alt="" fill className="object-contain" loading="eager" />
        </div>
        <div className="float-art-right absolute top-1/3 right-[5%] w-72 md:w-[32rem] aspect-square opacity-[0.07] grayscale">
          <Image src="/polaroid.png" alt="" fill className="object-contain" loading="eager" />
        </div>
      </div>

      <div className="relative z-10 w-full h-screen">
        
        {/* SCENE 1: INITIAL HERO (Matches Mockup) */}
        <section className="hero-scene h-full flex flex-col items-center justify-center px-6 md:px-16">
          <div className="hero-content text-center space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <h1 className="spaced-serif text-5xl md:text-8xl lg:text-[14rem] text-brand-red tracking-[0.3em] md:tracking-[0.5em] leading-none transition-all">
                ILAARA
              </h1>
              <p className="text-[8px] md:text-sm uppercase tracking-[0.6em] md:tracking-[1em] text-gray-400 font-bold opacity-60">
                A stitch starts here
              </p>
            </div>
            
            <div className="pt-16 md:pt-48">
              <Link 
                href="/shop" 
                className="px-12 md:px-20 py-6 md:py-8 bg-brand-red text-brand-cream text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black rounded-full hover:bg-brand-dark hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* Scroll Visual Indicator */}
          <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-20">
            <div className="w-[1px] h-10 md:h-12 bg-brand-red animate-scroll-line" />
            <span className="text-[7px] uppercase tracking-widest text-brand-red">Scroll</span>
          </div>
        </section>

        {/* SCENE 2: CHAPTER 1 - CROCHET */}
        <section className="chapter-1 absolute inset-0 opacity-0 flex flex-col items-center justify-center px-6 md:px-32">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="relative aspect-square shadow-2xl rounded-sm p-8 md:p-12 bg-white overflow-hidden group">
              <Image src="/crochet.png" alt="Handmade Crochet" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain transition-transform duration-700 group-hover:scale-110" priority />
            </div>
            <div className="space-y-6 md:space-y-10">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] text-brand-red font-black">Story 01</span>
              <h3 className="text-4xl md:text-9xl font-light italic font-serif leading-none tracking-tight text-brand-dark">The <br /> Texture.</h3>
              <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed max-w-sm">
                Woven from quiet hours. Each piece carries the weight of slow time.
              </p>
            </div>
          </div>
        </section>

        {/* SCENE 3: CHAPTER 2 - POLAROID */}
        <section className="chapter-2 absolute inset-0 opacity-0 flex flex-col items-center justify-center px-6 md:px-32">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="md:order-2 relative aspect-[4/3] shadow-2xl rounded-sm p-8 md:p-12 bg-white overflow-hidden group">
              <Image src="/polaroid.png" alt="Grainy Memories" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="md:order-1 space-y-6 md:space-y-10">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] text-brand-red font-black">Story 02</span>
              <h3 className="text-4xl md:text-9xl font-light italic font-serif leading-none tracking-tight text-brand-dark">The <br /> Moment.</h3>
              <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed max-w-sm">
                Capturing light that refuses to be duplicated. Grain and memory combined.
              </p>
            </div>
          </div>
        </section>

        {/* SCENE 4: FINAL CTA */}
        <section className="cta-scene absolute inset-0 opacity-0 flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-8 md:space-y-16">
            <h2 className="text-4xl md:text-9xl font-light italic font-serif text-brand-dark opacity-10 tracking-tighter leading-none">
              Honest craft, <br /> slowly made.
            </h2>
            <Link 
              href="/shop" 
              className="inline-block px-12 md:px-20 py-6 md:py-8 bg-brand-red text-brand-cream text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-black rounded-full hover:bg-brand-dark transition-all scale-105 md:scale-110"
            >
              Enter the Shop
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
