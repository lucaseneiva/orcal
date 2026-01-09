'use client'

import { useCart } from '@/app/context/cart-context'
import { submitOrder } from './actions'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Image as ImageIcon, 
  Info, 
  Check, 
  Loader2,
  ShoppingBag
} from 'lucide-react'

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Debug: Check what data is actually arriving in the cart
  useEffect(() => {
    if (items.length > 0) {
      console.log("Cart Items Data:", items);
    }
  }, [items]);

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.append('cart_items', JSON.stringify(items))
    const result = await submitOrder(formData)

    if (result.success) {
      setSuccess(true)
      clearCart()
    } else {
      alert('Erro ao enviar pedido: ' + result.error)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pedido Recebido!</h1>
        <p className="text-slate-600 mb-8 max-w-md">
          Recebemos sua solicitação. Em breve o lojista entrará em contato.
        </p>
        <Link 
          href="/" 
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Loja
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Seu orçamento está vazio</h2>
        <p className="text-slate-500 mb-6">Adicione produtos para solicitar um orçamento.</p>
        <Link href="/" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Explorar Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <Link href="/" className="text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 mb-8 w-fit">
        <ArrowLeft className="w-4 h-4" />
        Continuar Comprando
      </Link>

      <h1 className="text-3xl font-extrabold mb-10 text-slate-900 tracking-tight">Finalizar Orçamento</h1>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Left Side: Items List */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-lg font-semibold text-slate-800">Seus Itens ({items.length})</h2>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-slate-300 transition-all">
                <button
                  onClick={() => removeFromCart(idx)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-all z-20"
                  title="Remover item"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* --- IMAGE CONTAINER (Styles matched to ProductCard) --- */}
                <div className="relative w-28 h-28 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    /* Fallback exactly like ProductCard */
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                       <ImageIcon size={32} strokeWidth={1.5} />
                       <span className="text-[10px] mt-1 font-medium text-slate-400">Sem imagem</span>
                    </div>
                  )}
                </div>
                {/* -------------------------------------------------------- */}

                <div className="flex-1 py-1 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 pr-8">{item.productName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
                    <p className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      Qtd: <span className="font-bold text-slate-800">{item.quantity}</span>
                    </p>
                    {item.options.map((opt, i) => (
                      <p key={i} className="text-sm text-slate-500">
                        {opt.name}: <span className="font-medium text-slate-700">{opt.value}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/" className="text-slate-400 hover:text-slate-900 font-semibold text-sm uppercase tracking-widest transition-all flex items-center gap-2 group">
              <span>Adicionar mais produtos</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Informações de Contato</h2>
            
            <form action={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Seu Nome Completo</label>
                <input 
                  name="name" 
                  required 
                  className="w-full bg-slate-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="Ex: João Silva" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Seu melhor Email</label>
                <input 
                  name="email" 
                  required 
                  type="email" 
                  className="w-full bg-slate-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="seuemail@dominio.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">WhatsApp para Contato</label>
                <input 
                  name="whatsapp" 
                  required 
                  type="tel" 
                  className="w-full bg-slate-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="(00) 00000-0000" 
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>Solicitar Orçamento</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-3 items-start mt-4 px-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="text-blue-500 mt-0.5 shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Este é um pedido de orçamento. O pagamento e a entrega serão combinados diretamente com o vendedor após o contato.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}