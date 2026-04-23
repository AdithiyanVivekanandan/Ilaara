'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    enquiries: 0,
    products: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: ordersCount, data: ordersData },
        { count: enquiriesCount },
        { count: productsCount }
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
        supabase.from('enquiries').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' })
      ])

      const revenue = (ordersData || [])
        .filter(o => o.status !== 'pending' && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0)

      setStats({
        orders: ordersCount || 0,
        revenue,
        enquiries: enquiriesCount || 0,
        products: productsCount || 0
      })
      setRecentOrders(ordersData || [])
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navLinks = [
    { label: 'Overview', href: '/admin', active: true },
    { label: 'Inventory', href: '/admin/products' },
    { label: 'Activity', href: '/admin/orders' },
    { label: 'Messages', href: '/admin/enquiries' },
  ]

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex font-sans selection:bg-brand-red selection:text-white">
      {/* Sidebar - Elevated Design */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <div className="p-10">
          <Link href="/" className="spaced-serif text-2xl font-bold text-brand-red tracking-[0.4em]">ILAARA</Link>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">System Live</span>
          </div>
        </div>
        
        <nav className="flex-grow px-6 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center px-4 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all group ${
                link.active 
                ? 'bg-brand-red text-brand-cream shadow-lg shadow-brand-red/20' 
                : 'text-gray-400 hover:text-brand-red hover:bg-brand-red/5'
              }`}
            >
              {link.label}
              {!link.active && <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
            </Link>
          ))}
        </nav>

        <div className="p-10 border-t border-gray-50 space-y-6">
          <div className="bg-brand-cream/50 p-4 rounded-sm border border-brand-red/5">
            <p className="text-[9px] uppercase tracking-widest text-gray-400">Environment</p>
            <p className="text-[10px] font-bold text-brand-red">Production</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300 hover:text-brand-red transition-colors flex items-center gap-2"
          >
            Terminal Output 
          </button>
        </div>
      </aside>

      {/* Main Content - Minimal spacing */}
      <main className="flex-grow ml-72 p-16 space-y-16">
        <header className="flex justify-between items-end border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Welcome back.</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Control Center • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <Link href="/" className="px-8 py-3 border border-brand-red/20 text-[10px] uppercase tracking-[0.4em] text-brand-red font-black rounded-full hover:bg-brand-red hover:text-white transition-all">
            Live Site
          </Link>
        </header>

        {/* Stats Grid - High Contrast */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { label: 'Total Volume', value: stats.orders, suffix: ' Sales', color: 'text-brand-dark' },
            { label: 'Net Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, suffix: '', color: 'text-brand-red' },
            { label: 'Open Inquiries', value: stats.enquiries, suffix: ' Threads', color: 'text-brand-dark' },
            { label: 'Active Items', value: stats.products, suffix: ' SKUs', color: 'text-brand-dark' }
          ].map((stat, i) => (
            <div key={i} className="space-y-4 group cursor-default">
              <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 group-hover:text-brand-red transition-colors">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-5xl font-light tracking-tighter ${stat.color}`}>{stat.value}</p>
                <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">{stat.suffix}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Orders - Clean & Professional */}
        <section className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-brand-dark">Audit Logs & Activity</h3>
            <div className="flex gap-4">
              <button className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-brand-red transition-colors">Export .CSV</button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-16 text-center text-[10px] uppercase tracking-[1em] text-gray-300 animate-pulse">Syncing...</div>
            ) : recentOrders.length === 0 ? (
              <div className="p-24 text-center space-y-4">
                <p className="text-gray-200 text-6xl font-serif italic opacity-50">Nothing yet.</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Waiting for first connection</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-10 py-8 flex justify-between items-center hover:bg-gray-50 transition-all group">
                  <div className="space-y-2">
                    <p className="text-lg font-serif italic text-brand-dark group-hover:text-brand-red transition-colors">{order.buyer_name}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-bold">{new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="flex gap-16 items-center">
                    <span className={`text-[9px] uppercase tracking-[0.4em] px-5 py-2 rounded-full font-black border ${
                      order.status === 'confirmed' ? 'border-green-100 text-green-700 bg-green-50' :
                      order.status === 'pending' ? 'border-yellow-100 text-yellow-700 bg-yellow-50' :
                      'border-gray-100 text-gray-400 bg-gray-50'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-2xl font-light text-brand-dark tracking-tighter w-32 text-right">₹{order.total_amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
