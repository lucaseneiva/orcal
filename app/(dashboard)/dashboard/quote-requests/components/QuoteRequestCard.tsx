'use client'
import { useState } from 'react'
import { createClient } from '@/lib/utils/supabase/client'

export function QuoteRequestCard({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isViewed, setIsViewed] = useState(order.viewed || false)

  const handleToggle = async () => {
    const newOpenState = !isOpen
    setIsOpen(newOpenState)
    
    // Marca como visualizado ao abrir
    if (newOpenState && !isViewed) {
      setIsViewed(true)
      
      // Atualizar no banco de dados
      const supabase = createClient()
      await supabase
        .from('quote_requests')
        .update({ viewed: true })
        .eq('id', order.id)
    }
  }

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md ${!isViewed ? 'ring-2 ring-blue-400' : ''}`}>
      {/* Badge "NOVO" */}
      {!isViewed && (
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 text-center">
          🔔 NOVO PEDIDO
        </div>
      )}

      {/* Cabeçalho do Card */}
      <div 
        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-white hover:bg-gray-50"
        onClick={handleToggle}
      >
        <div className="flex items-start gap-4">
          {/* Indicador visual */}
          <div className={`w-3 h-3 mt-2 rounded-full ${!isViewed ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg">{order.customer_name}</h3>
              {!isViewed && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  Novo
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <span className="text-sm font-medium">{order.total_items} ite{order.total_items > 1 ? 'ns' : 'm'}</span>
          </div>
          {/* Seta indicando accordion */}
          <svg 
            className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Conteúdo Expandido */}
      {isOpen && (
        <div className="border-t bg-gray-50 p-5 animate-in slide-in-from-top-2 duration-200">
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Lista de Itens */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Itens do Pedido</h4>
              <ul className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="bg-white p-3 rounded border flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.options.map((opt: any, i: number) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {opt.name}: {opt.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                      x{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ações e Contato */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Ações Rápidas</h4>
                
                <a 
                  href={`https://wa.me/55${order.customer_whatsapp}?text=Olá ${order.customer_name}, recebi seu pedido de orçamento!`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-sm mb-3"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Chamar no WhatsApp
                </a>
              </div>

              <div className="bg-white p-4 rounded border">
                <h5 className="text-xs font-bold text-gray-500 mb-2">Dados do Cliente</h5>
                <p className="text-sm"><strong>Nome:</strong> {order.customer_name}</p>
                <p className="text-sm"><strong>Tel:</strong> {order.customer_whatsapp}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}