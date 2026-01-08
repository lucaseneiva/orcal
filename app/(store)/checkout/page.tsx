'use client'

import { useCart } from '@/app/context/cart-context'
import { submitOrder } from './actions'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)

    // Adiciona os itens do carrinho no FormData para enviar ao Server Action
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

  // Estado: Pedido finalizado com sucesso
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-4xl animate-bounce">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Recebido!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Recebemos sua solicitação. Em breve o lojista entrará em contato pelo WhatsApp informado para finalizar os detalhes.
        </p>
        <Link 
          href="/" 
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Voltar para a Loja
        </Link>
      </div>
    )
  }

  // Estado: Carrinho Vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu orçamento está vazio</h2>
        <p className="text-gray-500 mb-6">Adicione produtos para solicitar um orçamento.</p>
        <Link href="/" className="bg-black text-white px-6 py-2 rounded-lg font-medium">
          Explorar Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <Link href="/" className="text-sm font-medium text-gray-400 hover:text-black transition-colors flex items-center gap-2 mb-8">
        ← Continuar Comprando
      </Link>

      <h1 className="text-3xl font-extrabold mb-10 text-gray-900 tracking-tight">Finalizar Orçamento</h1>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Lado Esquerdo: Lista de Itens (3 colunas) */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800">Seus Itens ({items.length})</h2>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group hover:border-gray-300 transition-all">
                <button
                  onClick={() => removeFromCart(idx)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors z-20"
                  title="Remover item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>

                {/* Imagem Otimizada */}
                <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={item.imageUrl.includes('127.0.0.1') || item.imageUrl.includes('localhost')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m10-10H2"/></svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 py-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 pr-6">{item.productName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <p className="text-sm text-gray-500">Qtd: <span className="font-bold text-gray-800">{item.quantity}</span></p>
                    {item.options.map((opt, i) => (
                      <p key={i} className="text-sm text-gray-500">
                        {opt.name}: <span className="font-medium text-gray-700">{opt.value}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/" className="text-gray-400 hover:text-black font-semibold text-sm uppercase tracking-widest transition-all">
              + Adicionar mais produtos
            </Link>
          </div>
        </div>

        {/* Lado Direito: Formulário (2 colunas) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informações de Contato</h2>
            
            <form action={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Seu Nome Completo</label>
                <input 
                  name="name" 
                  required 
                  className="w-full bg-gray-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-black transition-all text-gray-900 placeholder:text-gray-400" 
                  placeholder="Ex: João Silva" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">WhatsApp para Contato</label>
                <input 
                  name="whatsapp" 
                  required 
                  type="tel" 
                  className="w-full bg-gray-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-black transition-all text-gray-900 placeholder:text-gray-400" 
                  placeholder="(00) 00000-0000" 
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Solicitar Orçamento</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2 items-start mt-4 px-2">
                <div className="bg-blue-50 text-blue-500 p-1 rounded-full mt-0.5">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
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