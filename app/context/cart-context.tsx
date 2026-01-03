'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  productId: string
  productName: string
  quantity: number
  imageUrl?: string
  // Vamos salvar o texto legível das opções (ex: "Papel: Couché")
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

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('cart-v1')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart-v1', JSON.stringify(items))
  }, [items])

  function addToCart(item: CartItem) {
    setItems(prev => [...prev, item]) 
  }

  function removeFromCart(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)