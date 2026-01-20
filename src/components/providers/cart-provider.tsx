'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '@/src/lib/types/types'

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart-v1')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      } catch (e) {
        console.error("Failed to load cart:", e)
      }
    }
  }, [])

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem('cart-v1', JSON.stringify(newItems))
  }

  function addToCart(item: CartItem) {
    const updated = [...items, item]
    updateCart(updated)
  }

  function removeFromCart(index: number) {
    const updated = items.filter((_, i) => i !== index)
    updateCart(updated)
  }

  function clearCart() {
    setItems([])
    localStorage.removeItem('cart-v1')
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}