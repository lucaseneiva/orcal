'use client'

import { useState, useEffect } from 'react'

// Tipagem básica para saber o que esperar do banco
type AttributeValue = {
  id: string
  label: string
}

type Attribute = {
  id: string
  name: string
  slug: string
  attribute_values: AttributeValue[]
}

interface ProductFormProps {
  product: any
  store: any
  availableAttributes: Attribute[] // <--- Recebemos a lista do banco aqui
}

export default function ProductForm({ product, store, availableAttributes }: ProductFormProps) {
  // 1. Estado para armazenar as escolhas (Ex: { material: "Couché", acabamento: "Verniz" })
  const [selections, setSelections] = useState<Record<string, string>>({})
  
  // 2. Estado para quantidade (Pega a primeira opção do produto ou 100 como fallback)
  // Assumindo que no banco você criou a coluna 'quantity_tiers' no produto
  const quantities = product.quantity_tiers || [100, 250, 500, 1000]; 
  const [qtd, setQtd] = useState(quantities[0])
  
  // Cor da loja
  const brandColor = store.primary_color || store.color || '#000000';

  // Função para atualizar o objeto de seleções
  const handleSelection = (slug: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      [slug]: value
    }))
  }

  // (Opcional) Pré-selecionar a primeira opção de cada atributo ao carregar
  useEffect(() => {
    const defaults: Record<string, string> = {};
    availableAttributes.forEach(attr => {
      if (attr.attribute_values.length > 0) {
        defaults[attr.slug] = attr.attribute_values[0].label;
      }
    });
    setSelections(defaults);
  }, [availableAttributes]);

  return (
    <div className="mt-8 space-y-6">
      
      {/* Grid de Atributos Dinâmicos */}
      {/* Se não tiver atributos, esconde essa div para não ficar buraco vazio */}
      {availableAttributes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {availableAttributes.map((attr) => (
            <div key={attr.id}>
              <label className="block text-sm font-bold text-gray-900 mb-1.5 capitalize">
                {attr.name}
              </label>
              
              <select 
                className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none"
                value={selections[attr.slug] || ''}
                style={{ accentColor: store.primary_color }}
                onChange={(e) => handleSelection(attr.slug, e.target.value)}
              >
                {/* Mapeia os valores (options) desse atributo */}
                {attr.attribute_values.map((val) => (
                  <option key={val.id} value={val.label}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Seleção de Quantidade */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Quantidade</label>
        <div className="flex flex-wrap gap-2">
          {quantities.map((q: number) => {
            const isSelected = qtd === q;
            return (
              <button
                key={q}
                onClick={() => setQtd(q)}
                style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor, color: '#FFF' } : {}}
                className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors ${
                  isSelected 
                  ? '' 
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                {q} un
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <button 
          style={{ backgroundColor: brandColor }}
          className="w-full text-white py-3.5 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-sm"
          onClick={() => {
            // Aqui você veria os dados prontos para enviar pro Supabase
            console.log('Dados do Pedido:', {
              productId: product.id,
              quantidade: qtd,
              opcoes: selections
            })
            alert(`Item configurado! Veja o console (F12).`)
          }}
        >
          Adicionar ao Carrinho
        </button>
        
        <button 
          className="w-full bg-white text-gray-800 border-2 border-gray-300 py-3.5 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-400 transition"
          onClick={() => alert('Abrir modal de orçamento...')}
        >
          Pedir Orçamento
        </button>
      </div>
    </div>
  )
}