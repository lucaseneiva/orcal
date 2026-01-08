'use client'

import { useCart } from '@/app/context/cart-context'
import { submitOrder } from './actions'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image' // Importação adicionada

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)

    // Injeta os itens do carrinho no FormData como string JSON
    formData.append('cart_items', JSON.stringify(items))

    const result = await submitOrder(formData)

    if (result.success) {
      setSuccess(true)
      clearCart() // Limpa o carrinho
    } else {
      alert('Erro ao enviar pedido: ' + result.error)
    }
    setLoading(false)
  }

  // View de Sucesso
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido Recebido!</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Recebemos sua solicitação de orçamento. O lojista foi notificado e entrará em contato pelo WhatsApp em breve.
        </p>
        <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800">
          Voltar para a Loja
        </Link>
      </div>
    )
  }

  // View de Carrinho Vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Seu orçamento está vazio</h2>
        <Link href="/" className="text-blue-600 underline">Voltar a comprar</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <Link href="/" className="text-lg text-gray-500 block hover:text-gray-700 transition-colors">
        ← Voltar
      </Link>
      
      <div className="p-4"></div>
      
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Finalizar Orçamento</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Lista de Itens */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-4 border-b pb-2">Itens Selecionados ({items.length})</h2>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-white p-4 rounded-lg border shadow-sm relative group">
                {/* Botão remover */}
                <button
                  onClick={() => removeFromCart(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 p-1"
                  aria-label="Remover item"
                >
                  ×
                </button>

                {/* Container da Imagem Otimizada */}
                {item.imageUrl && (
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded bg-gray-100 border">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.productName}
                      fill // Preenche o container de 16x16 (64px)
                      className="object-cover"
                      sizes="64px"
                      // Importante para funcionar com seu Supabase local:
                      unoptimized={
                        item.imageUrl.startsWith("http://127.0.0.1") || 
                        item.imageUrl.startsWith("http://localhost")
                      }
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 pr-6">{item.productName}</h3>
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <p>Quantidade: <span className="font-medium text-black">{item.quantity}</span></p>
                    {item.options.map((opt, i) => (
                      <p key={i} className="text-xs">
                        <span className="capitalize">{opt.name}</span>: <span className="text-gray-700">{opt.value}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center p-6">
            <Link href="/" prefetch={false}>
              <button
                className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg text-white transition-transform hover:scale-105 active:scale-95 bg-black"
              >
                Adicionar +
              </button>
            </Link>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Seus Dados</h2>
          <form action={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
              <input 
                name="name" 
                required 
                className="w-full border rounded p-2.5 outline-none focus:border-black transition-colors text-gray-600 bg-white" 
                placeholder="João da Silva" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input 
                name="whatsapp" 
                required 
                type="tel" 
                className="w-full border rounded p-2.5 outline-none focus:border-black transition-colors text-gray-600 bg-white" 
                placeholder="(11) 99999-9999" 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-black text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-gray-800 disabled:opacity-70 flex justify-center transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Solicitar Orçamento'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-2 px-4">
              Ao solicitar, seus dados e a lista de itens serão enviados ao lojista via WhatsApp.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}