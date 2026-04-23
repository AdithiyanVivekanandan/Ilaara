'use client'

import Navbar from '@/components/Navbar'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeFromCart, totalPrice, totalItems } = useCart()

  return (
    <main className="min-h-screen bg-brand-cream pt-32 px-8 md:px-16 pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-light text-brand-red italic font-serif">
            Your Collection
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
            {totalItems} {totalItems === 1 ? 'Piece' : 'Pieces'} Selected
          </p>
        </header>

        {items.length === 0 ? (
          <div className="py-24 text-center space-y-8">
            <p className="font-serif italic text-2xl text-gray-400">The collection is waiting for its first piece.</p>
            <Link href="/shop" className="inline-block px-12 py-4 bg-brand-red text-brand-cream text-[10px] uppercase tracking-widest rounded-full hover:bg-brand-dark transition-colors shadow-lg">
              Visit the Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Items List */}
            <div className="space-y-8 border-t border-gray-100 pt-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-8 items-center border-b border-gray-50 pb-8 last:border-0">
                  <div className="relative w-24 aspect-square bg-white rounded-sm overflow-hidden flex-shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <h3 className="text-sm uppercase tracking-wider text-brand-dark">{item.name}</h3>
                    <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[9px] uppercase tracking-widest text-brand-red font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-12 rounded-sm shadow-sm space-y-8">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-serif italic">Total Amount</span>
                <span className="text-2xl font-light">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-8 flex flex-col items-center gap-6">
                <Link 
                  href="/checkout" 
                  className="w-full text-center py-5 bg-brand-red text-brand-cream text-xs uppercase tracking-[0.3em] font-bold rounded-full hover:bg-brand-dark transition-all shadow-lg"
                >
                  Proceed to Payment
                </Link>
                <Link href="/shop" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-brand-red transition-colors">
                  ← Continue Exploring
                </Link>
              </div>
            </div>
            
            <p className="text-[10px] text-center text-gray-300 uppercase tracking-widest leading-loose">
              Every Ilaara piece is carefully packaged and shipped <br /> from our small studio in India.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
