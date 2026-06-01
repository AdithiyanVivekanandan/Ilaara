'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const devEmail = (process.env.NEXT_PUBLIC_DEV_EMAIL || '').toLowerCase().trim()
  const normalizedEmail = email.toLowerCase().trim()
  const isDevEmail = Boolean(devEmail) && normalizedEmail === devEmail

  const confirmationFailed = searchParams.get('error') === 'confirmation-failed'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isDevEmail) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: devEmail,
          password,
        })

        if (error) {
          setMessage(error.message || 'Unable to log in.')
        } else if (data.session) {
          router.push('/dev')
        } else {
          setMessage('Unable to log in.')
        }

        return
      }

      const response = await fetch('/api/admin/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Unable to send magic link.')
      } else {
        setMessage('Magic link sent to your email.')
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Unable to send magic link.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetDevPassword = async () => {
    if (!isDevEmail) return

    setResetting(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/reset-dev-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Unable to reset dev password.')
      } else {
        setPassword('12345678')
        setMessage('Dev password reset to 12345678. You can log in now.')
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Unable to reset dev password.')
    } finally {
      setResetting(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] translate-x-1/2 -translate-y-1/2 grayscale relative">
        <Image src="/crochet.png" alt="" fill className="object-contain" />
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
            {isDevEmail && (
              <div className="space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black">Dev email detected</p>
                <label className="text-[10px] uppercase tracking-[0.4em] text-brand-red font-black">Password</label>
                <input
                  required
                  type="password"
                  placeholder="Enter dev password"
                  className="w-full bg-transparent border-b-2 border-gray-100 py-4 text-sm outline-none focus:border-brand-red transition-all placeholder:text-gray-200"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleResetDevPassword}
                  disabled={resetting || loading}
                  className="text-[9px] uppercase tracking-[0.4em] text-brand-red font-black hover:opacity-70 transition-opacity disabled:opacity-50"
                >
                  {resetting ? 'Resetting...' : 'Reset dev password to 12345678'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              disabled={loading}
              className="w-full py-5 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isDevEmail ? 'Login as Dev' : 'Request Magic Link'}
            </button>
          </div>
        </form>

        {(message || confirmationFailed) && (
          <div className="text-center p-4 bg-brand-red/5 rounded-full border border-brand-red/10">
            <p className="text-[9px] uppercase tracking-widest text-brand-red font-bold animate-pulse">
              {message || 'Magic link failed or expired. Please request a new one.'}
            </p>
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
