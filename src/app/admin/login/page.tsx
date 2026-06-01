import { Suspense } from 'react'
import AdminLoginForm from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-cream flex items-center justify-center px-8">
          <div className="max-w-md w-full bg-white p-12 md:p-16 rounded-sm shadow-[0_40px_100px_-20px_rgba(139,0,0,0.1)]">
            <p className="text-center text-[10px] uppercase tracking-[0.4em] text-brand-red font-black">
              Loading admin portal...
            </p>
          </div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
