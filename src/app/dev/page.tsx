'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default function DevDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, enquiries: 0, products: 0 })
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      const [{ count: ordersCount }, { count: enquiriesCount }, { count: productsCount }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('enquiries').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' }),
      ])

      setStats({
        orders: ordersCount || 0,
        enquiries: enquiriesCount || 0,
        products: productsCount || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  const resetDefaults = async () => {
    if (!confirm('Reset orders back to pending and reopen products? This is a developer-only safe reset.')) {
      return
    }

    setResetting(true)
    setMessage('Resetting system defaults...')

    const [{ error: orderError }, { error: productError }] = await Promise.all([
      supabase.from('orders').update({ status: 'pending' }),
      supabase.from('products').update({ is_available: true }),
    ])

    if (orderError || productError) {
      setMessage(`Reset failed: ${orderError?.message || productError?.message}`)
    } else {
      setMessage('System defaults restored successfully.')
    }

    setResetting(false)
  }

  return (
    <AdminLayout activeTab="developer">
      <header className="flex flex-col gap-6 border-b border-gray-100 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Developer Control Room</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Backdoor access for trusted developers to inspect, manage, and restore the website safely.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin" className="px-8 py-3 border border-brand-red text-brand-red text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-red hover:text-white transition-all">Admin Dashboard</Link>
          <Link href="/" className="px-8 py-3 border border-gray-100 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:border-brand-red hover:text-brand-red transition-all">Live Site</Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { label: 'Total Orders', value: stats.orders, color: 'text-brand-red' },
          { label: 'Total Enquiries', value: stats.enquiries, color: 'text-brand-dark' },
          { label: 'Total Products', value: stats.products, color: 'text-brand-dark' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-10 rounded-sm border border-gray-100 shadow-sm">
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-400 font-bold">{stat.label}</p>
            <p className={`text-5xl font-light ${stat.color}`}>{loading ? '…' : stat.value}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-sm border border-gray-100 shadow-sm p-12 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">Developer Permissions</p>
            <h2 className="text-3xl font-serif italic text-brand-dark">Full site access with a safe restore path.</h2>
          </div>
          <button
            disabled={resetting}
            onClick={resetDefaults}
            className="px-8 py-4 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            {resetting ? 'Resetting…' : 'Return to Default Settings'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Key developer actions</p>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-600">
              <li>• Inspect all orders, enquiries, and products from the client website.</li>
              <li>• Manage admin access securely by using a dedicated developer email.</li>
              <li>• Restore site defaults without affecting the live brand experience.</li>
              <li>• Access the admin dashboard and perform the same UI-driven tasks in the same style.</li>
            </ul>
          </div>
          <div className="space-y-4 bg-brand-cream/70 p-6 rounded-sm border border-brand-red/10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Safety notice</p>
            <p className="text-sm text-gray-600 leading-relaxed">This developer portal is protected by the DEV_EMAIL environment setting and is not exposed to unauthorized users. Only the developer account can use this backdoor.</p>
            {message && <p className="text-[12px] text-brand-dark font-bold">{message}</p>}
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
