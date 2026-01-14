import { useState, useEffect } from 'react'
import { useCart } from '@/app/context/cart-context'
import { submitOrder } from '../actions'
import { toast } from 'sonner'

export function useCheckout() {
  const { items, removeFromCart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)


  useEffect(() => {
    if (items.length > 0) {
      console.log("Cart Items Data:", items);
    }
  }, [items]);

  async function handleFormSubmit(formData: FormData) {
    setLoading(true)

    formData.append('cart_items', JSON.stringify(items))

    const result = await submitOrder(formData)

    if (result.success) {
      setSuccess(true)
      clearCart()
      toast.success('Pedido de orçamento enviado!')
    } else {
      toast.error(result.error || 'Erro ao enviar pedido')
    }
    setLoading(false)
  }

  return {
    cartItems: items,
    removeFromCart,
    handleFormSubmit,
    loading,
    success,
    isEmpty: items.length === 0
  }
}