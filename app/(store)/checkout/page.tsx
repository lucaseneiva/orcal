'use client'

import { useCart } from '@/app/context/cart-context'
import { submitOrder } from './actions' // Vamos criar jajá
import { useState } from 'react'
import Link from 'next/link'

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
      <h1 className="text-2xl font-bold mb-8">Finalizar Orçamento</h1>
      
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
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>

                {item.imageUrl && (
                   <img src={item.imageUrl} className="w-16 h-16 object-cover rounded bg-gray-100" />
                )}
                
                <div>
                  <h3 className="font-bold text-gray-900">{item.productName}</h3>
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <p>Quantidade: <span className="font-medium text-black">{item.quantity}</span></p>
                    {item.options.map((opt, i) => (
                      <p key={i}>{opt.name}: {opt.value}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h2 className="font-semibold text-gray-700 mb-4">Seus Dados</h2>
          <form action={handleSubmit} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
              <input name="name" required className="w-full border rounded p-2.5 outline-none focus:border-black" placeholder="João da Silva" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input name="whatsapp" required type="tel" className="w-full border rounded p-2.5 outline-none focus:border-black" placeholder="(11) 99999-9999" />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-black text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-gray-800 disabled:opacity-70 flex justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Solicitar Orçamento'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              Nenhum pagamento é realizado agora.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}