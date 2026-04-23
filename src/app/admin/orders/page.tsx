'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/AdminLayout'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
    
    if (!error) fetchOrders()
    else alert(`Error updating status: ${error.message}`)
  }

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  const statusColors: Record<string, string> = {
    pending: 'border-yellow-100 text-yellow-600 bg-yellow-50',
    confirmed: 'border-green-100 text-green-600 bg-green-50',
    shipped: 'border-blue-100 text-blue-600 bg-blue-50',
    delivered: 'border-gray-100 text-gray-400 bg-gray-50',
    cancelled: 'border-red-100 text-brand-red bg-red-50',
  }

  return (
    <AdminLayout activeTab="orders">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Activity.</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Order Ledger • {orders.length} Records Tracked</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 border border-gray-100 text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black rounded-full hover:border-brand-red hover:text-brand-red transition-all">Download Audit</button>
        </div>
      </header>

      <section className="space-y-8">
        {loading ? (
          <div className="p-32 text-center text-[10px] uppercase tracking-[1em] text-gray-300 animate-pulse italic">Accessing the vault...</div>
        ) : orders.length === 0 ? (
          <div className="p-32 text-center space-y-6">
            <p className="text-gray-200 text-7xl font-serif italic opacity-30">The ledger is empty.</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Waiting for first connection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-sm border border-gray-100 p-12 shadow-sm space-y-12 hover:shadow-xl transition-all group">
                <header className="flex justify-between items-start">
                  <div className="space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">Ref ID: {order.id.slice(-12).toUpperCase()}</p>
                    <h3 className="text-4xl font-serif italic text-brand-dark group-hover:text-brand-red transition-colors">{order.buyer_name}</h3>
                    <p className="text-xs text-gray-400 tracking-widest">{order.buyer_email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-6">
                    <span className={`text-[10px] uppercase tracking-[0.5em] px-6 py-2.5 rounded-full font-black border transition-all ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <p className="text-4xl font-light text-brand-dark tracking-tighter">₹{order.total_amount.toLocaleString('en-IN')}</p>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-12 border-t border-gray-50">
                  <div className="space-y-4">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">Temporal Stamp</p>
                    <p className="text-xs font-medium text-brand-dark">{new Date(order.created_at).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">Logistics Path</p>
                    <p className="text-xs font-medium text-gray-500 leading-relaxed italic">
                      {order.shipping_address.line1}, <br /> {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">Administrative State</p>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map(s => (
                        <button 
                          key={s} 
                          onClick={() => updateStatus(order.id, s)}
                          disabled={order.status === s}
                          className={`text-[8px] uppercase tracking-[0.3em] px-4 py-2 rounded-full border-2 transition-all font-black ${
                            order.status === s 
                            ? 'border-brand-red bg-brand-red text-white scale-105 pointer-events-none' 
                            : 'border-transparent text-gray-300 hover:text-brand-red hover:border-brand-red/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F6] p-10 rounded-sm space-y-6 border border-gray-50/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] grayscale text-4xl italic font-serif">Bill of Sale</div>
                  <p className="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold border-b border-gray-100 pb-4">Manifest of Pieces</p>
                  <div className="space-y-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center group/item">
                        <div className="flex flex-col">
                          <span className="text-sm font-serif italic text-brand-dark group-hover/item:text-brand-red transition-colors">{item.name}</span>
                          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Qty: {item.quantity}</span>
                        </div>
                        <span className="text-sm font-light text-gray-500 tracking-tighter">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
