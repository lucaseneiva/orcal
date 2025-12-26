'use client'

import { useCart } from '@/components/providers/CartProvider'

export default function AddToCartButton({ product, color }: any) {
  const { addToCart } = useCart()

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      style={{ backgroundColor: color }}
    >
      Adicionar ao Orçamento
    </button>
  )
}