'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/AdminLayout'

export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setLogs(data)
      detectAnomalies(data)
    }
    setLoading(false)
  }

  function detectAnomalies(logData: any[]) {
    const ipCounts: Record<string, number> = {}
    const identifiedAnomalies: any[] = []

    logData.forEach(log => {
      ipCounts[log.ip_address] = (ipCounts[log.ip_address] || 0) + 1
      
      if (ipCounts[log.ip_address] > 10) {
        identifiedAnomalies.push({
          type: 'Rapid Requests',
          ip: log.ip_address,
          description: 'High velocity activity from this address'
        })
      }
    })

    setAnomalies([...new Set(identifiedAnomalies)])
  }

  return (
    <AdminLayout activeTab="security">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Shield.</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Security Audit & Anomaly Detection</p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Anomaly Dashboard */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-brand-red p-8 text-brand-cream rounded-sm shadow-xl space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60">System Threat Level</h3>
            <p className="text-5xl font-serif italic">Nominal</p>
          </div>

          <div className="bg-white p-8 border border-gray-100 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-red">Active Anomaly Flags</h3>
            {anomalies.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No suspicious patterns detected.</p>
            ) : (
              <div className="space-y-4">
                {anomalies.map((a, i) => (
                  <div key={i} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-sm">
                    <p className="text-[10px] font-black uppercase text-red-700">{a.type}</p>
                    <p className="text-xs text-red-600 mt-1">{a.ip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Access Logs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Temporal Access Manifest</h3>
              <button onClick={fetchLogs} className="text-[9px] uppercase tracking-widest text-brand-red font-bold">Refresh Logs</button>
            </div>
            
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-16 text-center text-[10px] tracking-widest text-gray-300 animate-pulse uppercase">Auditing System...</div>
              ) : logs.length === 0 ? (
                <div className="p-16 text-center text-sm text-gray-400 italic">Clear skies. No security logs found.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="px-10 py-6 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                    <div className="space-y-1">
                      <span className={`text-[8px] uppercase tracking-[0.3em] px-3 py-1 rounded-full font-black border ${
                        log.event_type === 'honeypot_hit' ? 'border-red-100 text-red-600 bg-red-50' :
                        log.event_type === 'rate_limit' ? 'border-yellow-100 text-yellow-600 bg-yellow-50' :
                        'border-gray-100 text-gray-400 bg-gray-100'
                      }`}>
                        {log.event_type.replace('_', ' ')}
                      </span>
                      <p className="text-xs font-mono text-gray-300 mt-2">{log.ip_address}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-brand-dark font-medium">{log.path}</p>
                      <p className="text-[9px] text-gray-300 uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
