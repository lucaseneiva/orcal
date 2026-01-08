'use client'

import { useState, useMemo } from 'react'
import { useCart } from '@/app/context/cart-context'
import { useRouter } from 'next/navigation'

// --- Tipagens ---

type ProductOption = {
  value_id: string
  value_name: string
  description: string | null
  attribute_id: string
  attribute_name: string
  attribute_slug: string
}

// Interface para substituir o 'any' do store
interface Store {
  primary_color?: string
  color?: string
}

interface ProductFormProps {
  product: {
    id: string
    name: string
    options: ProductOption[] 
    quantity_tiers?: number[]
  }
  store: Store // Substituído 'any' por 'Store'
}

export default function ProductForm({ product, store }: ProductFormProps) {
  const router = useRouter()
  const { addToCart } = useCart()

  // 1. Lógica de Agrupamento memorizada
  const groupedAttributes = useMemo(() => {
    const groups: Record<string, { 
      id: string, 
      name: string, 
      slug: string, 
      values: ProductOption[] 
    }> = {}

    product.options.forEach((opt) => {
      if (!groups[opt.attribute_id]) {
        groups[opt.attribute_id] = {
          id: opt.attribute_id,
          name: opt.attribute_name,
          slug: opt.attribute_slug,
          values: []
        }
      }
      groups[opt.attribute_id].values.push(opt)
    })

    return Object.values(groups)
  }, [product.options])

  // 2. SOLUÇÃO DO ERRO: Inicialização de estado síncrona
  // Passamos uma função para o useState para calcular os padrões apenas no primeiro render
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    
    // Calculamos os padrões diretamente dos options do produto
    const seenAttributes = new Set<string>()
    product.options.forEach((opt) => {
      if (!seenAttributes.has(opt.attribute_id)) {
        defaults[opt.attribute_id] = opt.value_id
        seenAttributes.add(opt.attribute_id)
      }
    })
    return defaults
  })
  
  const quantities = product.quantity_tiers || [100, 250, 500, 1000]
  const [qtd, setQtd] = useState(quantities[0])
  
  const brandColor = store.primary_color || store.color || '#000000'

  const handleSelection = (attributeId: string, valueId: string) => {
    setSelections((prev) => ({
      ...prev,
      [attributeId]: valueId
    }))
  }

  function handleAddToCart() {
    const selectedOptionsReadable = groupedAttributes.map(group => {
      const selectedValueId = selections[group.id]
      const selectedOption = group.values.find(v => v.value_id === selectedValueId)
      
      return {
        name: group.name,
        value: selectedOption?.value_name || 'Padrão'
      }
    })

    addToCart({
      productId: product.id,
      productName: product.name,
      quantity: qtd,
      options: selectedOptionsReadable
    })
    
    router.push('/checkout')
  }

  return (
    <div className="mt-8 space-y-6">
      {groupedAttributes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {groupedAttributes.map((attrGroup) => (
            <div key={attrGroup.id}>
              <label className="block text-sm font-bold text-gray-900 mb-1.5 capitalize">
                {attrGroup.name}
              </label>
              
              <select 
                className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none"
                value={selections[attrGroup.id] || ''}
                style={{ accentColor: brandColor }}
                onChange={(e) => handleSelection(attrGroup.id, e.target.value)}
              >
                {attrGroup.values.map((val) => (
                  <option key={val.value_id} value={val.value_id}>
                    {val.value_name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Quantidade</label>
        <div className="flex flex-wrap gap-2">
          {quantities.map((q) => {
            const isSelected = qtd === q
            return (
              <button
                key={q}
                type="button"
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

      <div className="flex flex-col gap-3">
        <button 
          type="button"
          style={{ backgroundColor: brandColor }}
          className="w-full text-white py-3.5 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-sm"
          onClick={handleAddToCart}
        >
          Adicionar ao Pedido
        </button>
      </div>  
    </div>
  )
}