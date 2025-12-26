'use client' // <--- Isso avisa pro Next: "Isso roda no navegador, não no servidor"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define como é um item do carrinho
export type CartItem = {
  id: string
  name: string
  price: string
  quantity: number
}

// Define quais funções estarão disponíveis
type CartContextType = {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  // Recuperar do localStorage quando a página carregar
  useEffect(() => {
    const saved = localStorage.getItem('orcamento_cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Erro ao ler carrinho', e)
      }
    }
  }, [])

  // Salvar no localStorage sempre que mudar algo
  useEffect(() => {
    localStorage.setItem('orcamento_cart', JSON.stringify(items))
  }, [items])

  // Função de adicionar
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setCartOpen(true) // Abre o carrinho automaticamente
  }

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => setItems([])

  // O "return" aqui é o tal do Wrapper. Ele envolve os "children" com o Contexto.
  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook para facilitar o uso nos outros componentes
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider')
  return context
}