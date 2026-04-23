'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useTheme } from '@/components/ThemeProvider'

export default function CustomizePage() {
  const { settings, updateSettings, loading: themeLoading } = useTheme()
  const [localSettings, setLocalSettings] = useState(settings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    await updateSettings(localSettings)
    setSaving(false)
    alert('Boutique aesthetic updated successfully.')
  }

  return (
    <AdminLayout activeTab="customize">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Customize.</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Boutique Identity & Core Aesthetic</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-4 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all disabled:opacity-50"
        >
          {saving ? 'Preserving...' : 'Save Configuration'}
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Navigation & Transparency */}
        <div className="space-y-12 bg-white p-12 border border-gray-100">
          <header className="space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Header Aesthetics</h3>
            <p className="text-xs text-gray-400">Control the density and blur of the "Glass Islands".</p>
          </header>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold">Island Opacity</label>
                <span className="text-[10px] font-mono">{(localSettings.navbar_opacity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={localSettings.navbar_opacity} 
                onChange={e => setLocalSettings({...localSettings, navbar_opacity: parseFloat(e.target.value)})}
                className="w-full accent-brand-red"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold">Backdrop Blur</label>
                <span className="text-[10px] font-mono">{localSettings.glass_blur}px</span>
              </div>
              <input 
                type="range" min="0" max="40" step="1" 
                value={localSettings.glass_blur} 
                onChange={e => setLocalSettings({...localSettings, glass_blur: parseInt(e.target.value)})}
                className="w-full accent-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Brand Palette */}
        <div className="space-y-12 bg-white p-12 border border-gray-100">
          <header className="space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Color Story</h3>
            <p className="text-xs text-gray-400">The primary pigment used across buttons, links, and accents.</p>
          </header>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold">Primary Brand Color</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="color" 
                  value={localSettings.brand_color} 
                  onChange={e => setLocalSettings({...localSettings, brand_color: e.target.value})}
                  className="w-16 h-16 rounded-full border-0 cursor-pointer overflow-hidden p-0"
                />
                <input 
                  type="text" 
                  value={localSettings.brand_color} 
                  onChange={e => setLocalSettings({...localSettings, brand_color: e.target.value})}
                  className="bg-transparent border-b border-gray-100 py-2 font-mono text-xs uppercase" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold">Element Roundness</label>
              <div className="flex justify-between">
                <input 
                  type="range" min="0" max="32" step="4" 
                  value={localSettings.corner_radius} 
                  onChange={e => setLocalSettings({...localSettings, corner_radius: parseInt(e.target.value)})}
                  className="w-2/3 accent-brand-red"
                />
                <span className="text-[10px] font-mono">{localSettings.corner_radius === 0 ? 'Sharp' : `${localSettings.corner_radius}px`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Content */}
        <div className="md:col-span-2 space-y-12 bg-white p-12 border border-gray-100">
          <header className="space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Hero Narrative</h3>
            <p className="text-xs text-gray-400">The first words customers see when they step into the Ilaara collection.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold">Main Title</label>
              <input 
                type="text" 
                value={localSettings.hero_title} 
                onChange={e => setLocalSettings({...localSettings, hero_title: e.target.value})}
                className="w-full bg-transparent border-b border-gray-100 py-3 text-2xl font-serif italic" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold">Catchphrase</label>
              <textarea 
                rows={2}
                value={localSettings.hero_subtitle} 
                onChange={e => setLocalSettings({...localSettings, hero_subtitle: e.target.value})}
                className="w-full bg-transparent border-b border-gray-100 py-3 text-sm text-gray-500" 
              />
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
