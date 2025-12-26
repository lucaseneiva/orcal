'use client'

import { useCart } from './providers/CartProvider'
import { submitLead } from '@/app/actions/submit-lead' // Vamos criar no passo 4
import { useState } from 'react'

export function CartDrawer({ primaryColor }: { primaryColor: string }) {
  const { items, removeFromCart, cartOpen, setCartOpen, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!cartOpen) return null

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    // Injetamos os itens no formData via JSON
    formData.append('items', JSON.stringify(items))
    
    // Server Action
    const result = await submitLead(formData)
    
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      clearCart()
      setTimeout(() => {
        setSuccess(false)
        setCartOpen(false)
      }, 3000)
    } else {
      alert('Erro ao enviar. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay Escuro */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => setCartOpen(false)}
      />

      {/* Painel Lateral */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-900">Seu Orçamento</h2>
          <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-red-500">
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-green-600">
            <span className="text-5xl mb-4">✅</span>
            <h3 className="text-xl font-bold">Solicitação Enviada!</h3>
            <p className="text-sm mt-2 text-slate-500">Em breve entraremos em contato.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Seu carrinho está vazio.
          </div>
        ) : (
          <>
            {/* Lista de Itens */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 text-xs hover:text-red-600"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Formulário */}
            <form action={handleSubmit} className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Seu Nome</label>
                <input name="name" required className="w-full border rounded p-2 text-sm" placeholder="Ex: João da Silva" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">WhatsApp</label>
                <input name="whatsapp" required className="w-full border rounded p-2 text-sm" placeholder="(00) 00000-0000" />
              </div>
              
              <button 
                disabled={loading}
                className="w-full py-3 text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Enviando...' : 'Solicitar Orçamento'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}