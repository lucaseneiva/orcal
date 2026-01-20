'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Imports internos
import { useCart } from '@/src/components/providers/cart-provider' // Usando o provider consolidado
import { submitOrder } from '@/src/actions/checkout.actions'
import { CheckoutSuccess } from '@/src/components/modules/checkout/checkout-success'
import { EmptyCartView } from '@/src/components/modules/checkout/empty-cart-view'
import { CartItemList } from '@/src/components/modules/checkout/cart-item-list'
import { CheckoutForm } from '@/src/components/modules/checkout/checkout-form'

type CheckoutPageProps = {
  primaryColor?: string
}

export default function CheckoutPage({ primaryColor }: CheckoutPageProps) {
  const { items, removeFromCart, clearCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleFormSubmit(formData: FormData) {
    if (items.length === 0) {
      toast.error('O carrinho está vazio')
      return
    }

    setLoading(true)

    formData.append('cart_items', JSON.stringify(items))

    try {
      const result = await submitOrder(formData)

      if (result.success) {
        setSuccess(true)
        clearCart()
        toast.success('Pedido de orçamento enviado!')
      } else {
        toast.error(result.error || 'Erro ao enviar pedido')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // --- Views Condicionais ---

  if (success) {
    return (
      <CheckoutSuccess primaryColor={primaryColor} />
    )
  }

  if (items.length === 0) {
    return (
      <EmptyCartView
        primaryColor={primaryColor}
        title="Seu orçamento está vazio"
        description="Adicione produtos para solicitar um orçamento."
        ctaLabel="Explorar Produtos"
        ctaHref="/"
      />
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link
        href="/"
        className="text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 mb-8 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Continuar Comprando
      </Link>

      <h1 className="text-3xl font-extrabold mb-10 text-slate-900 tracking-tight">
        Finalizar Orçamento
      </h1>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Lista de Itens */}
        <CartItemList
          items={items}
          onRemove={removeFromCart}
        />

        {/* Botão Mobile "Adicionar Mais" */}
        <div className="mt-8 flex justify-center lg:hidden">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-900 font-semibold text-sm uppercase tracking-widest transition-all flex items-center gap-2 group"
          >
            <span>Adicionar mais produtos</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-2">
          <CheckoutForm
            onSubmit={handleFormSubmit}
            loading={loading}
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </div>
  )
}