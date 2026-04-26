'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type SiteConfig = {
  shop: {
    columns: 2 | 3 | 4
    isMasonry: boolean
    filterStyle: 'pills' | 'tabs' | 'minimal'
    hoverEffect: 'lift' | 'zoom' | 'grayscale'
    imageRatio: 'square' | 'portrait' | 'landscape'
    titleAlign: 'left' | 'center'
  }
  product: {
    galleryStyle: 'large' | 'thumbnails' | 'stacked'
    ctaStyle: 'full' | 'inline' | 'filled' | 'outlined'
    showRelated: boolean
    showBreadcrumbs: boolean
    mobileZoom: boolean
  }
  home: {
    scrollSpeed: number
    parallaxIntensity: number
    logoSize: number
    navStyle: 'underline' | 'pill' | 'plain'
    overlayOpacity: number
    showFooter: boolean
    hero_title: string
    hero_subtitle: string
    stories: Array<{ title: string; body: string; image: string }>
  }
  theme: {
    bg_color: string
    primary_color: string
    secondary_color: string
    tertiary_color: string
    navbar_opacity: number
    glass_blur: number
    radius: number
    pageTransition: 'fade' | 'slide-up' | 'instant'
  }
}

function hexToRgb(hex: string) {
  let normalized = hex.replace('#', '').trim()
  if (normalized.length === 3) {
    normalized = normalized.split('').map((c) => c + c).join('')
  }

  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
}

function clampColor(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function adjustColor(hex: string, amount: number) {
  const cleaned = hex.replace('#', '')
  const rgb = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned
  const parsed = parseInt(rgb, 16)
  const r = clampColor(((parsed >> 16) & 255) + amount)
  const g = clampColor(((parsed >> 8) & 255) + amount)
  const b = clampColor((parsed & 255) + amount)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export const defaultSettings: SiteConfig = {
  shop: {
    columns: 2,
    isMasonry: false,
    filterStyle: 'minimal',
    hoverEffect: 'zoom',
    imageRatio: 'portrait',
    titleAlign: 'center',
  },
  product: {
    galleryStyle: 'large',
    ctaStyle: 'full',
    showRelated: true,
    showBreadcrumbs: false,
    mobileZoom: false,
  },
  home: {
    scrollSpeed: 1,
    parallaxIntensity: 1,
    logoSize: 1,
    navStyle: 'plain',
    overlayOpacity: 0.2,
    showFooter: true,
    hero_title: 'ILAARA',
    hero_subtitle: 'A stitch starts here',
    stories: [
      {
        title: 'Story 01',
        body: 'The art of crochet is a delicate dance between thread and imagination.',
        image: '/crochet.png'
      },
      {
        title: 'Story 02',
        body: 'Capturing fleeting moments in a polaroid is capturing time itself.',
        image: '/polaroid.png'
      }
    ],
  },
  theme: {
    bg_color: '#FAF9F6',
    primary_color: '#8B0000',
    secondary_color: '#F8EEEA',
    tertiary_color: '#1A1A1A',
    navbar_opacity: 0.9,
    glass_blur: 20,
    radius: 0,
    pageTransition: 'fade',
  }
}

const ThemeContext = createContext<{
  settings: SiteConfig
  updateSettings: (newSettings: Partial<SiteConfig>) => Promise<void>
  resetToOriginal: () => Promise<void>
  loading: boolean
}>({
  settings: defaultSettings,
  updateSettings: async () => {},
  resetToOriginal: async () => {},
  loading: true,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteConfig>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (!error && data && data.config) {
        // Merge with defaults to prevent missing fields
        setSettings({
          shop: { ...defaultSettings.shop, ...data.config.shop },
          product: { ...defaultSettings.product, ...data.config.product },
          home: { ...defaultSettings.home, ...data.config.home },
          theme: { ...defaultSettings.theme, ...data.config.theme },
        })
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  useEffect(() => {
    // Inject CSS variables
    const root = document.documentElement
    root.style.setProperty('--navbar-opacity', settings.theme.navbar_opacity.toString())
    root.style.setProperty('--glass-blur', `${settings.theme.glass_blur}px`)
    root.style.setProperty('--color-primary', settings.theme.primary_color)
    root.style.setProperty('--color-secondary', settings.theme.secondary_color)
    root.style.setProperty('--color-tertiary', settings.theme.tertiary_color)
    root.style.setProperty('--color-brand-red', settings.theme.primary_color)
    root.style.setProperty('--color-brand-cream', settings.theme.secondary_color)
    root.style.setProperty('--color-brand-dark', settings.theme.tertiary_color)
    root.style.setProperty('--bg-color', settings.theme.bg_color)
    root.style.setProperty('--color-background', settings.theme.bg_color)
    root.style.setProperty('--color-foreground', settings.theme.tertiary_color)
    root.style.setProperty('--radius-sm', `${settings.theme.radius}px`)
    root.style.setProperty('--radius-full', settings.theme.radius > 0 ? `${settings.theme.radius * 2}px` : '9999px')
    root.style.setProperty('--primary-rgb', hexToRgb(settings.theme.primary_color))
    root.style.setProperty('--secondary-rgb', hexToRgb(settings.theme.secondary_color))
    root.style.setProperty('--tertiary-rgb', hexToRgb(settings.theme.tertiary_color))
    root.style.setProperty('--glass-rgb', hexToRgb(settings.theme.primary_color))
  }, [settings])

  async function updateSettings(newSettings: Partial<SiteConfig>) {
    const updated = {
      ...settings,
      ...newSettings,
      shop: { ...settings.shop, ...(newSettings.shop || {}) },
      product: { ...settings.product, ...(newSettings.product || {}) },
      home: { ...settings.home, ...(newSettings.home || {}) },
      theme: { ...settings.theme, ...(newSettings.theme || {}) },
    }
    setSettings(updated)

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, config: updated })

    if (error) console.error('Failed to save settings:', error)
  }

  async function resetToOriginal() {
    setSettings(defaultSettings)
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, config: defaultSettings })

    if (error) console.error('Failed to reset settings:', error)
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetToOriginal, loading }}>
      <div 
        className={`min-h-screen transition-opacity duration-500`}
        style={{ backgroundColor: 'var(--bg-color)' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
