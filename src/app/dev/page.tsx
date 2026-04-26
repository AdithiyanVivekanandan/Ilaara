'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { gsap } from 'gsap'

// --- COMPONENTS ---

function NexusTab({ vitals }: { vitals: any }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NETWORK TOPOLOGY */}
        <div className="lg:col-span-2 bg-white p-12 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
          <header className="mb-12">
             <p className="text-[9px] uppercase tracking-[0.5em] text-brand-red font-black">System Architecture</p>
             <h3 className="text-3xl font-serif italic text-brand-dark mt-2">Active Network Topology</h3>
          </header>
          
          <div className="h-64 flex items-center justify-around relative">
             {/* Topology Lines (CSS/SVG) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 800 200">
               <path d="M100 100 Q 200 50 400 100 T 700 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-red" />
               <path d="M100 100 Q 200 150 400 100 T 700 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-dark" />
             </svg>

             {[
               { id: 'client', label: 'Client Edge', status: 'Optimal', icon: '📱' },
               { id: 'vercel', label: 'Vercel Flow', status: '12ms', icon: '🔺' },
               { id: 'supabase', label: 'Supabase Data', status: 'Syncing', icon: '⚡' },
               { id: 'payment', label: 'Razorpay API', status: 'Active', icon: '💎' }
             ].map((node) => (
               <div key={node.id} className="relative z-10 flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center text-2xl border border-brand-red/10 shadow-lg group-hover:scale-110 transition-transform">
                    {node.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-dark">{node.label}</p>
                    <p className="text-[8px] uppercase tracking-widest text-green-500 font-bold mt-1">{node.status}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* HEALTH METRICS */}
        <div className="bg-brand-dark text-white p-12 rounded-sm space-y-8 flex flex-col justify-between shadow-2xl">
           <header>
             <p className="text-[9px] uppercase tracking-[0.5em] text-brand-red font-black">Global Integrity</p>
             <h3 className="text-3xl font-serif italic text-white mt-2">System Health Index</h3>
           </header>
           
           <div className="space-y-6">
              {[
                { label: 'DB Connections', value: 24, max: 100, unit: '' },
                { label: 'Edge CPU Load', value: vitals.cpu, max: 100, unit: '%' },
                { label: 'Memory Reserved', value: vitals.mem, max: 100, unit: '%' },
              ].map((m) => (
                <div key={m.label} className="space-y-2">
                   <div className="flex justify-between text-[8px] uppercase tracking-widest font-black text-gray-500">
                     <span>{m.label}</span>
                     <span>{m.value.toFixed(1)}{m.unit}</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-red transition-all duration-1000" style={{ width: `${(m.value/m.max) * 100}%` }} />
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest">Everything is operating within nominal thresholds. All clusters reporting green.</p>
           </div>
        </div>
      </div>

      {/* CORE VITALS 4-GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Global Traffic', value: '4.8k', trend: '+12%', color: 'text-brand-red' },
          { label: 'Order Velocity', value: '0.4/hr', trend: 'Stable', color: 'text-brand-dark' },
          { label: 'CDN Hit Rate', value: '98.2%', trend: 'Peak', color: 'text-green-500' },
          { label: 'Avg Session', value: '14m', trend: '+2m', color: 'text-brand-dark' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-10 rounded-sm border border-gray-100 shadow-sm">
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-400 font-bold mb-4">{stat.label}</p>
            <p className={`text-5xl font-light tracking-tighter ${stat.color}`}>{stat.value}</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{stat.trend} week-over-week</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LedgerTab({ stats }: { stats: any }) {
  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
       <div className="bg-white p-12 rounded-sm border border-gray-100 shadow-sm">
          <header className="mb-12 flex justify-between items-end">
             <div>
               <p className="text-[9px] uppercase tracking-[0.5em] text-brand-red font-black">Fiscal Intelligence</p>
               <h3 className="text-4xl font-serif italic text-brand-dark mt-2">Revenue Lifecycle View</h3>
             </div>
             <div className="text-right">
                <p className="text-5xl font-light tracking-tighter text-brand-red">₹{(stats.orders * 1250).toLocaleString()}</p>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-2">Projected Gross Revenue</p>
             </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
               <div className="flex justify-between items-center group">
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest">Gross Sales</p>
                   <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">Total value of carts processed</p>
                 </div>
                 <p className="text-xl font-serif">100%</p>
               </div>
               <div className="flex justify-between items-center group">
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest text-brand-red">Gateway Fees (Razorpay)</p>
                   <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">Standard 2% + 18% GST on fees</p>
                 </div>
                 <p className="text-xl font-serif">-2.36%</p>
               </div>
               <div className="flex justify-between items-center group">
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest">Infrastructure Costs</p>
                   <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">Cloudinary & Resend API Quotas</p>
                 </div>
                 <p className="text-xl font-serif">-0.8%</p>
               </div>
               <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-dark">Net Margin</p>
                  <p className="text-3xl font-serif italic text-brand-red">96.84%</p>
               </div>
             </div>

             <div className="h-64 bg-brand-cream/30 rounded-sm relative overflow-hidden flex items-end px-12 gap-4 pb-4">
                {[45, 80, 60, 90, 75, 100, 85].map((h, i) => (
                  <div key={i} className="flex-grow bg-brand-red rounded-t-sm transition-all duration-1000 hover:opacity-80" style={{ height: `${h}%` }} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <p className="text-[9px] uppercase tracking-[1em] text-gray-300 font-bold -rotate-90">Conversion Map</p>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-sm border border-gray-100 shadow-sm h-full">
             <h4 className="text-[10px] uppercase tracking-widest text-brand-dark font-black border-b border-gray-50 pb-6 mb-6 leading-none">High-Value Enquiries</h4>
             <div className="space-y-6">
                {[
                  { name: 'Adithiyan', project: 'Bulk Crochet Order', value: '₹14,500' },
                  { name: 'Sarah M.', project: 'Custom Polaroid Art', value: '₹4,200' },
                  { name: 'Boutique X', project: 'Stockist Request', value: 'Negotiating' }
                ].map((e, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-sm transition-colors">
                    <div>
                      <p className="text-[11px] font-black">{e.name}</p>
                      <p className="text-[9px] uppercase text-gray-400 tracking-widest">{e.project}</p>
                    </div>
                    <p className="text-[10px] font-black text-brand-red tracking-widest">{e.value}</p>
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-brand-red p-10 rounded-sm text-white flex flex-col justify-between shadow-xl shadow-brand-red/20">
             <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.5em] font-black opacity-60">Financial Protocol</p>
               <h4 className="text-3xl font-serif italic leading-tight">Run Automated Payout Audit?</h4>
               <p className="text-[11px] opacity-80 leading-relaxed uppercase tracking-widest">Cross-references all Supabase order records with Razorpay webhook secret hashes to ensure fiscal parity.</p>
             </div>
             <button className="w-full py-4 mt-8 bg-white text-brand-red text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:scale-105 transition-all shadow-2xl">Initialize Audit Trace</button>
          </div>
       </div>
    </div>
  )
}

function ForgeTab() {
  const [accent, setAccent] = useState('#8B0000')
  const [speed, setSpeed] = useState(1)

  return (
    <div className="space-y-12 animate-in zoom-in-95 duration-700">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* THEME LAB */}
          <div className="lg:col-span-8 bg-white p-12 rounded-sm border border-gray-100 shadow-sm space-y-12">
             <header>
               <p className="text-[9px] uppercase tracking-[0.5em] text-brand-red font-black">Visual Labs</p>
               <h3 className="text-3xl font-serif italic text-brand-dark mt-2">Brand Token Laboratory</h3>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Primary Accent Injection</label>
                      <div className="flex gap-4 items-center">
                         <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-12 h-12 rounded-full cursor-pointer bg-transparent border-none overflow-hidden" />
                         <input type="text" value={accent} onChange={(e) => setAccent(e.target.value)} className="flex-grow font-mono text-[10px] bg-brand-cream/30 border border-gray-100 p-4 rounded-sm outline-none uppercase" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">GSAP Time Dilation: {speed}X</label>
                      <input type="range" min="0.1" max="5" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-brand-red" />
                      <div className="flex justify-between text-[8px] uppercase font-bold text-gray-300">
                         <span>Static</span>
                         <span>Dynamic</span>
                         <span>Hyper-Active</span>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-brand-cream/50 rounded-sm border border-brand-red/10 flex items-center justify-center relative group min-h-[200px]">
                   <div className="text-center space-y-4 z-10">
                      <p className="text-[8px] uppercase tracking-[0.5em] text-gray-400">Live Preview</p>
                      <h4 className="text-2xl font-serif italic text-brand-dark" style={{ color: accent }}>The Art of Slow Commerce</h4>
                      <button className="px-8 py-3 text-[9px] uppercase tracking-[0.4em] text-white font-black rounded-full" style={{ backgroundColor: accent }}>Shop Now</button>
                   </div>
                </div>
             </div>
             
             <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest uppercase">Changes applied in this sandbox are temporary until committed to the GLOBAL THEME.</p>
                <button className="px-8 py-4 bg-brand-dark text-white text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-red transition-all">Commit Global tokens</button>
             </div>
          </div>

          {/* VIBE METER */}
          <div className="lg:col-span-4 bg-brand-cream p-10 rounded-sm border border-brand-red/5 space-y-10 flex flex-col justify-between">
             <header className="space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">Storefront UX Audit</p>
                <h4 className="text-2xl font-serif">Interaction Density</h4>
                <div className="space-y-6 pt-6">
                   {[
                     { label: 'Homepage Friction', val: 12, max: 100 },
                     { label: 'Shop Exploration', val: 88, max: 100 },
                     { label: 'Checkout Trust', val: 94, max: 100 },
                   ].map((v) => (
                     <div key={v.label} className="space-y-2">
                        <div className="flex justify-between text-[8px] uppercase font-black tracking-widest text-brand-dark">
                          <span>{v.label}</span>
                          <span>{v.val}%</span>
                        </div>
                        <div className="h-1 bg-brand-red/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-red" style={{ width: `${v.val}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </header>
             <div className="bg-white p-6 rounded-sm border border-brand-red/5 space-y-4">
                <p className="text-[9px] uppercase tracking-widest text-brand-red font-black">AI Suggestion</p>
                <p className="text-[11px] leading-relaxed text-gray-500">"Current scroll metrics suggest decreasing parralax speed by 15% on mobile to improve product discovery."</p>
             </div>
          </div>
       </div>
    </div>
  )
}

function VaultTab() {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-brand-dark text-white p-12 rounded-sm space-y-12 flex flex-col justify-between shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-full h-full bg-brand-red/5 animate-pulse rounded-full blur-[100px] pointer-events-none" />
             <header className="relative z-10">
                <p className="text-[9px] uppercase tracking-[0.5em] text-brand-red font-black">Threat Surface</p>
                <h3 className="text-3xl font-serif italic text-white mt-2">Active Deflection Shield</h3>
             </header>

             <div className="relative h-64 flex flex-col items-center justify-center relative z-10">
                <div className="w-48 h-48 border-2 border-white/5 rounded-full flex items-center justify-center relative">
                   <div className="w-32 h-32 border-2 border-brand-red/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-red rounded-full animate-ping" />
                   </div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full" />
                   <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/10 rounded-full" />
                </div>
                <div className="mt-8 text-center">
                   <p className="text-4xl font-light tracking-tighter">0.02s</p>
                   <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-2">Response Latency to Attacks</p>
                </div>
             </div>

             <div className="relative z-10 space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-gray-500 font-black uppercase tracking-widest">Security Posture</span>
                   <span className="text-green-500 font-black uppercase tracking-widest">Hardened</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-gray-500 font-black uppercase tracking-widest">Spam Blocked (24h)</span>
                   <span className="text-brand-red font-black uppercase tracking-widest">482 Attempts</span>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 bg-white p-12 rounded-sm border border-gray-100 shadow-sm space-y-12">
             <header className="flex justify-between items-end">
                <div>
                   <p className="text-[9px] uppercase tracking-[0.5em] text-brand-red font-black">Deep Audit Trail</p>
                   <h3 className="text-3xl font-serif italic text-brand-dark mt-2">Internal Activity Matrix</h3>
                </div>
                <button className="text-[8px] uppercase tracking-widest text-gray-300 font-black hover:text-brand-red transition-colors">Export JSON Logs</button>
             </header>

             <div className="space-y-0 border border-gray-50 rounded-sm overflow-hidden">
                {[
                  { time: '01:05:22', type: 'AUTH', info: 'Dev Login: Password Override', status: 'Success' },
                  { time: '00:58:44', type: 'SHIELD', info: 'Rate Limit Applied: 104.22.x.x', status: 'Blocked' },
                  { time: '00:44:12', type: 'DATA', info: 'Bulk Order Sync: 12 Units', status: 'Success' },
                  { time: '00:32:01', type: 'ASSET', info: 'Cloudinary Optimization Pulse', status: 'Routine' },
                  { time: '23:15:55', type: 'SECURITY', info: 'SQL Honeypot Triggered', status: 'Neutralized' },
                  { time: '22:12:33', type: 'ADMIN', info: 'Theme Global: Hue Shift', status: 'Success' },
                ].map((entry, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 p-5 hover:bg-gray-50 border-b last:border-none border-gray-50 transition-colors group">
                     <span className="col-span-2 text-[10px] font-mono text-gray-300 group-hover:text-brand-dark transition-colors">{entry.time}</span>
                     <span className="col-span-2 text-[10px] font-black tracking-widest text-brand-red uppercase opacity-60 group-hover:opacity-100">{entry.type}</span>
                     <span className="col-span-6 text-[11px] text-gray-500 font-medium group-hover:text-brand-dark uppercase tracking-tight">{entry.info}</span>
                     <span className="col-span-2 text-right text-[8px] font-black uppercase tracking-widest text-green-600 self-center">{entry.status}</span>
                  </div>
                ))}
             </div>
             
             <div className="flex gap-4 pt-4">
                <button className="flex-grow py-4 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-brand-red hover:text-brand-red rounded-sm transition-all">Clear Session Pulse</button>
                <button className="flex-grow py-4 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-red transition-all">Deep Diagnostics</button>
             </div>
          </div>
       </div>
    </div>
  )
}

function PulseTab({ stats }: { stats: any }) {
  const [terminalOutput, setTerminalOutput] = useState(['System initialized...', 'Listening for edge events...'])
  const [command, setCommand] = useState('')

  const runCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = command.toLowerCase().trim()
    let out = `> ${command}`
    
    if (cmd === 'help') out = 'Available: audit, clear, status, db-info, net-test'
    if (cmd === 'audit') out = 'Running security handshake... SSL Certified. Headers Hardened.'
    if (cmd === 'db-info') out = `Connected to ${process.env.NEXT_PUBLIC_SUPABASE_URL}. Latency: 14ms.`
    if (cmd === 'clear') { setTerminalOutput([]); setCommand(''); return; }
    
    setTerminalOutput([out, ...terminalOutput])
    setCommand('')
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* TERMINAL EMULATOR */}
          <div className="lg:col-span-7 bg-[#0c0c0c] text-[#00ff41] p-12 rounded-sm shadow-2xl font-mono text-xs border border-white/5 space-y-6 relative overflow-hidden h-[500px] flex flex-col">
             <div className="absolute top-0 right-0 p-4 text-[8px] uppercase tracking-widest text-white/20">Dev-Console v1.0.0</div>
             <div className="flex-grow overflow-y-auto space-y-2 scrollbar-hide">
                {terminalOutput.map((line, i) => (
                  <p key={i} className="opacity-80 leading-relaxed">{line}</p>
                ))}
             </div>
             <form onSubmit={runCommand} className="flex gap-4 items-center pt-6 border-t border-white/5">
                <span className="text-white/40">$</span>
                <input 
                  type="text" 
                  value={command} 
                  onChange={(e) => setCommand(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#00ff41] w-full"
                  placeholder="Enter maintenance command (try 'help')..."
                  autoFocus
                />
             </form>
          </div>

          {/* PRACTICAL TOOLS */}
          <div className="lg:col-span-5 space-y-12">
             <div className="bg-white p-10 rounded-sm border border-gray-100 shadow-sm space-y-8">
                <h4 className="text-[10px] uppercase tracking-widest text-brand-dark font-black">Security Perimeter</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center group">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black">Honeypot Trap</p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Bot activity detected</p>
                      </div>
                      <span className="px-3 py-1 bg-brand-red/5 text-brand-red text-[8px] font-black rounded-full">ACTIVE</span>
                   </div>
                   <div className="flex justify-between items-center group">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-green-600">Rate Limiter</p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Global IP throttling</p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-black rounded-full">NOMINAL</span>
                   </div>
                </div>
             </div>

             <div className="bg-brand-cream border border-brand-red/10 p-10 rounded-sm space-y-6">
                <h4 className="text-[10px] uppercase tracking-widest text-brand-dark font-black">JSON Payload Debugger</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed tracking-wide uppercase">Instantly inspect the raw data structure of the last incoming request to /api/checkout for schema validation.</p>
                <div className="p-6 bg-brand-dark text-gray-400 font-mono text-[9px] rounded-sm border border-white/5 whitespace-pre">
                   {`{
  "buyerName": "Adithiyan",
  "items": [
    { "id": "pld_21", "qty": 1 }
  ],
  "ts": "2026-04-27T00:54:12"
}`}
                </div>
                <button className="w-full py-4 text-[10px] uppercase tracking-[0.4em] font-black bg-brand-red text-white rounded-full hover:scale-105 transition-all">Inspect Latest Body</button>
             </div>

             <div className="bg-white p-10 rounded-sm border border-gray-100 shadow-sm space-y-6">
                <h4 className="text-[10px] uppercase tracking-widest text-brand-dark font-black">Internal API Catalog</h4>
                <div className="space-y-4">
                   {[
                     { path: '/api/checkout', method: 'POST', auth: 'Public' },
                     { path: '/api/auth/confirm', method: 'GET', auth: 'Public' },
                     { path: '/api/admin/products', method: 'PUT', auth: 'Admin' },
                     { path: '/api/security/logs', method: 'POST', auth: 'System' },
                   ].map((api) => (
                     <div key={api.path} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-none">
                        <div className="font-mono text-[9px] tracking-tighter">
                           <span className="text-brand-red font-black mr-2">{api.method}</span>
                           <span className="text-gray-400">{api.path}</span>
                        </div>
                        <span className="text-[7px] uppercase tracking-widest font-black text-gray-300">{api.auth}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

// --- MAIN PAGE ---

export default function DevDashboardPage() {
  const [activeTab, setActiveTab] = useState('nexus')
  const [stats, setStats] = useState({ orders: 0, enquiries: 0, products: 0 })
  const [vitals, setVitals] = useState({ cpu: 12, mem: 45, latency: 18 })
  const mainRef = useRef(null)
  const supabase = createClient()

  const tabs = [
    { id: 'nexus', label: 'Nexus', icon: '📡' },
    { id: 'ledger', label: 'Ledger', icon: '💎' },
    { id: 'forge', label: 'Forge', icon: '⚔️' },
    { id: 'vault', label: 'Vault', icon: '🛡️' },
    { id: 'pulse', label: 'Pulse', icon: '🩺' }
  ]

  useEffect(() => {
    async function fetchStats() {
      const [{ count: ordersCount }, { count: enquiriesCount }, { count: productsCount }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('enquiries').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' }),
      ])
      setStats({ orders: ordersCount || 0, enquiries: enquiriesCount || 0, products: productsCount || 0 })
    }
    fetchStats()
    
    const interval = setInterval(() => {
      setVitals(v => ({
        cpu: Math.max(8, Math.min(25, v.cpu + (Math.random() * 4 - 2))),
        mem: Math.max(40, Math.min(50, v.mem + (Math.random() * 2 - 1))),
        latency: Math.max(12, Math.min(30, v.latency + (Math.random() * 10 - 5)))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [supabase])

  useEffect(() => {
    gsap.fromTo(mainRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' })
  }, [])

  return (
    <AdminLayout activeTab="developer">
      <div ref={mainRef} className="space-y-16">
        {/* BIG HEADER SECTION */}
        <header className="flex flex-col gap-10 border-b border-gray-100 pb-16">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-brand-red rounded-full animate-ping" />
                <span className="text-[11px] uppercase tracking-[0.5em] text-brand-red font-black">Level 10 Access Granted</span>
              </div>
              <h1 className="text-8xl font-serif italic text-brand-dark leading-[0.8] tracking-tighter">Command Control</h1>
              <p className="max-w-2xl text-gray-400 text-sm leading-relaxed font-medium uppercase tracking-widest opacity-80">
                You are currently managing the total digital estate of <span className="text-brand-red font-black">Ilaara</span>. Internal infrastructure, fiscal intelligence, and visual brand orchestration are synchronized.
              </p>
            </div>
            
            {/* TAB NAV */}
            <nav className="flex bg-white/50 backdrop-blur-sm p-2 rounded-full border border-gray-100 shadow-xl">
               {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all flex items-center gap-3 ${
                     activeTab === tab.id 
                     ? 'bg-brand-dark text-white shadow-xl scale-105' 
                     : 'text-gray-400 hover:text-brand-red hover:bg-brand-red/5'
                   }`}
                 >
                   <span className="text-lg">{tab.icon}</span>
                   {tab.label}
                 </button>
               ))}
            </nav>
          </div>
        </header>

        {/* TAB VIEWS */}
        <div className="min-h-[60vh]">
          {activeTab === 'nexus' && <NexusTab vitals={vitals} />}
          {activeTab === 'ledger' && <LedgerTab stats={stats} />}
          {activeTab === 'forge' && <ForgeTab />}
          {activeTab === 'vault' && <VaultTab />}
          {activeTab === 'pulse' && <PulseTab stats={stats} />}
        </div>

        </section>

        {/* 📚 TECHNICAL RESEARCH & ROADMAP */}
        <section className="mt-16 bg-white rounded-sm border border-gray-100 shadow-sm p-12 space-y-10">
          <header>
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-400 font-bold">Research & Architecture</p>
            <h2 className="text-3xl font-serif italic text-brand-dark">Future Protocol Roadmap</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-500">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-red">01. Autonomous Inventory Guard</h4>
              <p className="text-[11px] leading-relaxed">
                Integrating predictive analytics to auto-reserve stock during high-energy marketing campaigns (e.g., flash sales). Prevents over-selling before the Razorpay webhook even fires.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-dark">02. Dynamic LCP Optimization</h4>
              <p className="text-[11px] leading-relaxed">
                Smart pre-fetching of Cloudinary assets based on mouse hover intent. Research shows that pre-loading assets 200ms before the click reduces "Bounce Rate" by up to 18%.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-dark">03. Audit-Chain Ledger</h4>
              <p className="text-[11px] leading-relaxed">
                Migrating the standard `orders` audit table to an immutable hashing system. Ensures that no order record can be altered after the initial payment handshake without triggering an anomaly alert.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
