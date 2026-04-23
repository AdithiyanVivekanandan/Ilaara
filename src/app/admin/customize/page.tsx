'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useTheme, SiteConfig, defaultSettings } from '@/components/ThemeProvider'

export default function CustomizePage() {
  const { settings, updateSettings, resetToOriginal, loading: themeLoading } = useTheme()
  const [localSettings, setLocalSettings] = useState<SiteConfig>(settings)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'theme' | 'home' | 'shop' | 'product'>('theme')

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    await updateSettings(localSettings)
    setSaving(false)
    alert('Config updated successfully.')
  }

  const handleRevert = async () => {
    if (confirm('Are you sure you want to revert to the original Ilaara aesthetic? All customizations will be lost.')) {
      setSaving(true)
      await resetToOriginal()
      setSaving(false)
    }
  }

  const updateSection = (section: keyof SiteConfig, key: string, value: any) => {
    setLocalSettings({
      ...localSettings,
      [section]: {
        ...localSettings[section as keyof SiteConfig],
        [key]: value
      }
    })
  }

  return (
    <AdminLayout activeTab="customize">
      <header className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif italic text-brand-dark leading-none">Customize.</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-medium">Full Spectrum Engine</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRevert}
            disabled={saving}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Revert to Original
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-brand-red text-brand-cream text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            {saving ? 'Preserving...' : 'Save Configuration'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 py-4">
        {['theme', 'home', 'shop', 'product'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-all ${
              activeTab === tab ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="mt-8">
        {activeTab === 'theme' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8 bg-white p-8 border border-gray-100">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Global Aesthetics</h3>
              
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Background Color</label>
                <div className="flex gap-4 items-center">
                  <input type="color" value={localSettings.theme.bg_color} onChange={e => updateSection('theme', 'bg_color', e.target.value)} className="w-10 h-10 border-0" />
                  <input type="text" value={localSettings.theme.bg_color} onChange={e => updateSection('theme', 'bg_color', e.target.value)} className="border-b text-xs py-1" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Brand Color</label>
                <div className="flex gap-4 items-center">
                  <input type="color" value={localSettings.theme.brand_color} onChange={e => updateSection('theme', 'brand_color', e.target.value)} className="w-10 h-10 border-0" />
                  <input type="text" value={localSettings.theme.brand_color} onChange={e => updateSection('theme', 'brand_color', e.target.value)} className="border-b text-xs py-1" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Element Roundness (px)</label>
                <input type="range" min="0" max="32" step="2" value={localSettings.theme.radius} onChange={e => updateSection('theme', 'radius', parseInt(e.target.value))} className="w-full" />
                <div className="text-xs text-right">{localSettings.theme.radius}px</div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Page Transitions</label>
                <select value={localSettings.theme.pageTransition} onChange={e => updateSection('theme', 'pageTransition', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="fade">Fade</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="instant">Instant</option>
                </select>
              </div>
            </div>

            <div className="space-y-8 bg-white p-8 border border-gray-100">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Header & Glass</h3>
              
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Glass Opacity: {localSettings.theme.navbar_opacity.toFixed(2)}</label>
                <input type="range" min="0" max="1" step="0.05" value={localSettings.theme.navbar_opacity} onChange={e => updateSection('theme', 'navbar_opacity', parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Glass Blur: {localSettings.theme.glass_blur}px</label>
                <input type="range" min="0" max="40" step="1" value={localSettings.theme.glass_blur} onChange={e => updateSection('theme', 'glass_blur', parseInt(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Navigation Link Style</label>
                <select value={localSettings.home.navStyle} onChange={e => updateSection('home', 'navStyle', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="plain">Plain</option>
                  <option value="underline">Underline</option>
                  <option value="pill">Pill</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8 bg-white p-8 border border-gray-100">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Hero Section</h3>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Main Title</label>
                <input type="text" value={localSettings.home.hero_title} onChange={e => updateSection('home', 'hero_title', e.target.value)} className="w-full p-2 border text-lg" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Subtitle</label>
                <input type="text" value={localSettings.home.hero_subtitle} onChange={e => updateSection('home', 'hero_subtitle', e.target.value)} className="w-full p-2 border text-sm" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Logo Scale: {localSettings.home.logoSize.toFixed(1)}x</label>
                <input type="range" min="0.5" max="2" step="0.1" value={localSettings.home.logoSize} onChange={e => updateSection('home', 'logoSize', parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="space-y-8 bg-white p-8 border border-gray-100">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Scroll & Parallax</h3>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Animation Speed: {localSettings.home.scrollSpeed.toFixed(1)}x</label>
                <input type="range" min="0.5" max="3" step="0.1" value={localSettings.home.scrollSpeed} onChange={e => updateSection('home', 'scrollSpeed', parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Parallax Intensity: {localSettings.home.parallaxIntensity.toFixed(1)}x</label>
                <input type="range" min="0" max="3" step="0.1" value={localSettings.home.parallaxIntensity} onChange={e => updateSection('home', 'parallaxIntensity', parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                  <input type="checkbox" checked={localSettings.home.showFooter} onChange={e => updateSection('home', 'showFooter', e.target.checked)} />
                  Show Footer
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="bg-white p-8 border border-gray-100 max-w-2xl space-y-8">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Collection Grid Setup</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Columns Desktop</label>
                <select value={localSettings.shop.columns} onChange={e => updateSection('shop', 'columns', parseInt(e.target.value))} className="w-full p-2 border text-sm">
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mt-8">
                  <input type="checkbox" checked={localSettings.shop.isMasonry} onChange={e => updateSection('shop', 'isMasonry', e.target.checked)} />
                  Enable Masonry Grid
                </label>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Filter Style</label>
                <select value={localSettings.shop.filterStyle} onChange={e => updateSection('shop', 'filterStyle', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="minimal">Minimal Text</option>
                  <option value="pills">Pills</option>
                  <option value="tabs">Tabs</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Title Alignment</label>
                <select value={localSettings.shop.titleAlign} onChange={e => updateSection('shop', 'titleAlign', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Card Aspect Ratio</label>
                <select value={localSettings.shop.imageRatio} onChange={e => updateSection('shop', 'imageRatio', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="portrait">Portrait (4:5)</option>
                  <option value="square">Square (1:1)</option>
                  <option value="landscape">Landscape (4:3)</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Card Hover Effect</label>
                <select value={localSettings.shop.hoverEffect} onChange={e => updateSection('shop', 'hoverEffect', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="zoom">Image Zoom</option>
                  <option value="lift">Shadow Lift</option>
                  <option value="grayscale">Grayscale to Color</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'product' && (
          <div className="bg-white p-8 border border-gray-100 max-w-2xl space-y-8">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-red">Product Display</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Gallery Style</label>
                <select value={localSettings.product.galleryStyle} onChange={e => updateSection('product', 'galleryStyle', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="large">Single Large Layout</option>
                  <option value="thumbnails">Thumbnails Strip</option>
                  <option value="stacked">Stacked Scroll</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold">Button Style</label>
                <select value={localSettings.product.ctaStyle} onChange={e => updateSection('product', 'ctaStyle', e.target.value)} className="w-full p-2 border text-sm">
                  <option value="full">Full Width Filled</option>
                  <option value="inline">Inline Filled</option>
                  <option value="outlined">Outlined Minimal</option>
                </select>
              </div>
              <div className="col-span-2 space-y-4 border-t pt-4">
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                    <input type="checkbox" checked={localSettings.product.showBreadcrumbs} onChange={e => updateSection('product', 'showBreadcrumbs', e.target.checked)} />
                    Show Breadcrumbs
                  </label>
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                    <input type="checkbox" checked={localSettings.product.showRelated} onChange={e => updateSection('product', 'showRelated', e.target.checked)} />
                    Show Related Products
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
