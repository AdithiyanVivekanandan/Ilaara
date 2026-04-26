'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const devEmail = process.env.NEXT_PUBLIC_DEV_EMAIL?.toLowerCase().trim() || ''
  const isDeveloper = devEmail && email.trim().toLowerCase() === devEmail
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') === 'confirmation-failed') {
        setMessage('Magic link failed or expired. Please request a new one.')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const nextPath = isDeveloper ? '/dev' : '/admin'

    if (usePassword) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage(`Login failed: ${error.message}`)
      } else {
        // Redirect manually since we are using password
        window.location.href = nextPath
      }
    } else {
      const redirectUrl = `${siteUrl}/api/auth/confirm?next=${nextPath}`
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        const extra = isDeveloper
          ? ' Tip: You might be rate-limited by Supabase (3 per hour). Try Password Login instead!'
          : ''
        setMessage(`Error: ${error.message}${extra}`)
      } else {
        setMessage('Magic link sent to your email.')
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-8 relative overflow-hidden">
      {/* Background Decorative Art */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] translate-x-1/2 -translate-y-1/2 grayscale">
        <img src="/crochet.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-md w-full bg-white p-12 md:p-16 rounded-sm shadow-[0_40px_100px_-20px_rgba(139,0,0,0.1)] space-y-12 relative z-10">
        <header className="text-center space-y-4">
          <Link href="/" className="spaced-serif text-3xl font-bold text-brand-red tracking-[0.4em] hover:opacity-70 transition-opacity">
            ILAARA
          </Link>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Admin Portal</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-brand-red font-black">Email Address</label>
              <input
                required
                type="email"
                placeholder="admin@ilaara.art"
                className="w-full bg-transparent border-b-2 border-gray-100 py-4 text-sm outline-none focus:border-brand-red transition-all placeholder:text-gray-200"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {isDeveloper && usePassword && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] uppercase tracking-[0.4em] text-brand-red font-black">Developer Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b-2 border-gray-100 py-4 text-sm outline-none focus:border-brand-red transition-all placeholder:text-gray-200"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              disabled={loading}
              className="w-full py-5 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (isDeveloper && usePassword) ? 'Secure Dev Login' : 'Request Magic Link'}
            </button>

            {isDeveloper && (
              <button
                type="button"
                onClick={() => setUsePassword(!usePassword)}
                className="w-full text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold hover:text-brand-red transition-colors"
              >
                {usePassword ? 'Use Magic Link instead' : 'Override with Password Login'}
              </button>
            )}
          </div>
        </form>

        {message && (
          <div className="text-center p-4 bg-brand-red/5 rounded-full border border-brand-red/10">
            <p className="text-[9px] uppercase tracking-widest text-brand-red font-bold animate-pulse">
              {message}
            </p>
          </div>
        )}

        {isDeveloper && !message && (
          <div className="text-center p-4 bg-brand-cream/10 rounded-full border border-brand-red/10">
            <p className="text-[9px] uppercase tracking-widest text-brand-red font-bold">
              Developer email detected.
            </p>
            <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400">
              Ensure this address is registered in Supabase Auth if signups are disabled.
            </p>
          </div>
        )}

        {isDeveloper && (
          <div className="text-center space-y-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-brand-red font-black">Developer email detected</p>
            <p className="text-[10px] text-gray-500">You will be redirected to the Dev Portal after authentication.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-brand-red transition-colors">
            ← Return to Story
          </Link>
        </div>
      </div>
    </main>
  )
}
