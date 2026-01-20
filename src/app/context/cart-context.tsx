'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  productId: string
  productName: string
  quantity: number
  imageUrl?: string
  options: { name: string; value: string }[] 
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // 1. CARREGAMENTO: Apenas uma vez no mount
  useEffect(() => {
    const saved = localStorage.getItem('cart-v1')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Usamos um timeout de 0ms para "empurrar" o setState para fora 
        // do ciclo de renderização síncrono do mount, eliminando o erro de cascata.
        setTimeout(() => {
          setItems(parsed)
        }, 0)
      } catch (e) {
        console.error("Erro ao carregar:", e)
      }
    }
  }, [])

  // 2. SALVAMENTO: Mover a lógica de salvar para as funções (Actions)
  // Isso remove o segundo useEffect e evita o erro de cascading renders
  const persist = (newItems: CartItem[]) => {
    localStorage.setItem('cart-v1', JSON.stringify(newItems))
  }

  function addToCart(item: CartItem) {
    setItems(prev => {
      const updated = [...prev, item]
      persist(updated)
      return updated
    })
  }

  function removeFromCart(index: number) {
    setItems(prev => {
      const updated = prev.filter((_, i) => i !== index)
      persist(updated)
      return updated
    })
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

export const useCart = () => useContext(CartContext)