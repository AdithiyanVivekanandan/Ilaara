'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Persistence using sessionStorage for privacy (as per docs)
  useEffect(() => {
    const savedCart = sessionStorage.getItem('ilaara_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('ilaara_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.id === newItem.id)
      if (existing) {
        return current.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i)
      }
      return [...current, newItem]
    })
  }

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
