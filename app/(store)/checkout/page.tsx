'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCheckout } from './hooks/useCheckout'
import { CheckoutSuccess } from './components/checkout-success'
import { EmptyCartView } from './components/empty-cart-view'
import { CartItemList } from './components/cart-item-list'
import { CheckoutForm } from './components/checkout-form'

export default function CheckoutPage() {
  const { 
    cartItems, 
    removeFromCart, 
    handleFormSubmit, 
    loading, 
    success, 
    isEmpty 
  } = useCheckout()

  if (success) {
    return <CheckoutSuccess />
  }

  if (isEmpty) {
    return <EmptyCartView />
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link href="/" className="text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 mb-8 w-fit">
        <ArrowLeft className="w-4 h-4" />
        Continuar Comprando
      </Link>

      <h1 className="text-3xl font-extrabold mb-10 text-slate-900 tracking-tight">
        Finalizar Orçamento
      </h1>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Left Side: Items List */}
        <CartItemList 
          items={cartItems} 
          onRemove={removeFromCart} 
        />
        
        <div className="mt-8 flex justify-center lg:hidden">
            <Link href="/" className="text-slate-400 hover:text-slate-900 font-semibold text-sm uppercase tracking-widest transition-all flex items-center gap-2 group">
              <span>Adicionar mais produtos</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2">
          <CheckoutForm 
            onSubmit={handleFormSubmit} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  )
}