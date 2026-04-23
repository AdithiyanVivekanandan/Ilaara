'use client'

import Link from 'next/link'

export default function AdminUnauthorizedPage() {
  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grayscale">
        <img src="/crochet.png" alt="" className="absolute top-0 right-0 w-96 h-96 translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="max-w-md w-full bg-white p-12 md:p-16 rounded-sm shadow-2xl space-y-10 text-center relative z-10 border border-brand-red/5">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-brand-red/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-4xl font-serif italic text-brand-dark leading-tight">Access Restricted.</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 font-bold leading-relaxed">
            Your account is authenticated, but this email address is not in the authorized administrator list.
          </p>
        </div>

        <div className="pt-6 space-y-6">
          <div className="p-4 bg-brand-red/5 rounded-sm border border-brand-red/10">
            <p className="text-[9px] uppercase tracking-widest text-brand-red font-black">Authorized Personnel Only</p>
            <p className="text-[10px] text-gray-400 mt-1">Please contact the system owner or update your environment configuration.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/admin/login" 
              className="w-full py-4 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all shadow-xl"
            >
              Try Different Email
            </Link>
            <Link 
              href="/" 
              className="text-[10px] uppercase tracking-[0.4em] text-gray-300 hover:text-brand-red transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
