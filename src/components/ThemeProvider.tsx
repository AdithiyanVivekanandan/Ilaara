'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type SiteSettings = {
  navbar_opacity: number
  glass_blur: number
  brand_color: string
  hero_title: string
  hero_subtitle: string
  background_effect: 'none' | 'aurora' | 'minimal'
  corner_radius: number
}

const defaultSettings: SiteSettings = {
  navbar_opacity: 0.9,
  glass_blur: 20,
  brand_color: '#8B0000',
  hero_title: 'A Stitch Starts Here',
  hero_subtitle: 'Handmade crochet and craft storytelling.',
  background_effect: 'minimal',
  corner_radius: 0,
}

const ThemeContext = createContext<{
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>
  loading: boolean
}>({
  settings: defaultSettings,
  updateSettings: async () => {},
  loading: true,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (!error && data) {
        setSettings(data.config || defaultSettings)
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  useEffect(() => {
    // Inject CSS variables
    const root = document.documentElement
    root.style.setProperty('--navbar-opacity', settings.navbar_opacity.toString())
    root.style.setProperty('--glass-blur', `${settings.glass_blur}px`)
    root.style.setProperty('--color-brand-red', settings.brand_color)
    root.style.setProperty('--radius-sm', `${settings.corner_radius}px`)
    root.style.setProperty('--radius-full', settings.corner_radius > 0 ? `${settings.corner_radius * 2}px` : '9999px')
  }, [settings])

  async function updateSettings(newSettings: Partial<SiteSettings>) {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, config: updated })

    if (error) console.error('Failed to save settings:', error)
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
