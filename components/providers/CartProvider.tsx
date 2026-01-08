'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'

// --- Tipagens ---

export type CartItem = {
  id: string
  name: string
  price: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// --- Provider ---

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  
  // Ref para garantir que o salvamento só ocorra após o carregamento inicial
  const isHydrated = useRef(false)

  // 1. CARREGAMENTO: Executa apenas uma vez na montagem do componente
  useEffect(() => {
    const saved = localStorage.getItem('orcamento_cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Usamos um agendamento de tarefa (Task) para evitar o erro de cascata
          // Isso garante que o render inicial do Next termine antes da atualização
          setTimeout(() => {
            setItems(parsed)
            isHydrated.current = true
          }, 0)
          return
        }
      } catch (e) {
        console.error('Erro ao ler carrinho', e)
      }
    }
    isHydrated.current = true
  }, [])

  // 2. PERSISTÊNCIA: Função auxiliar para salvar no disco
  const saveToStorage = (newItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orcamento_cart', JSON.stringify(newItems))
    }
  }

  // 3. AÇÕES: Atualizam o estado e o storage simultaneamente
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      let updated: CartItem[]

      if (existing) {
        updated = prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      } else {
        updated = [...prev, { ...product, quantity: 1 }]
      }

      saveToStorage(updated)
      return updated
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id)
      saveToStorage(updated)
      return updated
    })
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('orcamento_cart')
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider')
  return context
}