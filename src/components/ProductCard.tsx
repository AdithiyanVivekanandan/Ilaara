'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/components/ThemeProvider'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  images: string[]
  is_available: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { settings } = useTheme()

  const getAspectRatioClass = () => {
    switch (settings.shop.imageRatio) {
      case 'square': return 'aspect-square'
      case 'landscape': return 'aspect-[4/3]'
      case 'portrait':
      default: return 'aspect-[4/5]'
    }
  }

  const getHoverClass = () => {
    let base = 'relative overflow-hidden transition-all duration-700 '
    switch (settings.shop.hoverEffect) {
      case 'zoom': return base + 'group-hover:shadow-xl'
      case 'lift': return base + 'group-hover:-translate-y-2 group-hover:shadow-2xl'
      case 'grayscale': return base + 'grayscale group-hover:grayscale-0 group-hover:shadow-lg'
      default: return base + 'group-hover:shadow-xl'
    }
  }

  const getImageHoverClass = () => {
    return settings.shop.hoverEffect === 'zoom' || settings.shop.hoverEffect === 'lift' 
      ? 'object-cover transition-transform duration-700 group-hover:scale-110' 
      : 'object-cover transition-transform duration-700 group-hover:scale-105'
  }

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group block space-y-4"
    >
      <div 
        className={`${getAspectRatioClass()} ${getHoverClass()}`}
        style={{ borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-color)' }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={getImageHoverClass()}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 italic text-gray-400 font-serif">
            No image
          </div>
        )}
        
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-[var(--color-brand-red)] text-white text-[10px] uppercase tracking-widest px-4 py-1 rounded-[var(--radius-full)]">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start pt-2 gap-2">
        <div className="space-y-1">
          <h3 className="text-[10px] md:text-sm uppercase tracking-wider text-gray-900 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-400">
            {product.category}
          </p>
        </div>
        <p className="text-[10px] md:text-sm font-light whitespace-nowrap text-gray-800">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  )
}
