'use client'

import Link from 'next/link'
import Image from 'next/image'

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
  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group block space-y-4"
    >
      <div className="relative aspect-[4/5] bg-brand-cream overflow-hidden rounded-sm transition-all duration-700 group-hover:shadow-xl">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 italic text-gray-400 font-serif">
            No image
          </div>
        )}
        
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-brand-red text-brand-cream text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1">
          <h3 className="text-sm uppercase tracking-wider text-brand-dark group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            {product.category}
          </p>
        </div>
        <p className="text-sm font-light">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  )
}
