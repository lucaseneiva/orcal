'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCart } from '@/app/context/cart-context' // <--- Importe
import { useRouter } from 'next/navigation' // <--- Importe

// 1. Tipagem atualizada conforme o retorno da nossa Query anterior
type ProductOption = {
  value_id: string
  value_name: string      // Ex: "Couché 300g"
  value_meta: string | null
  attribute_id: string
  attribute_name: string  // Ex: "Papel"
  attribute_slug: string
}

interface ProductFormProps {
  product: {
    id: string
    name: string
    // O array plano que vem do banco
    options: ProductOption[] 
    quantity_tiers?: number[] // Opcional, caso venha do banco
  }
  store: any
}

export default function ProductForm({ product, store }: ProductFormProps) {
  const router = useRouter()
  const { addToCart } = useCart()

  // Estado para armazenar os IDs selecionados: { [attribute_id]: value_id }
  const [selections, setSelections] = useState<Record<string, string>>({})
  
  // Quantidades
  const quantities = product.quantity_tiers || [100, 250, 500, 1000]
  const [qtd, setQtd] = useState(quantities[0])
  
  const brandColor = store.primary_color || store.color || '#000000'

  // 2. Lógica de Agrupamento (O Pulo do Gato)
  // Transforma o array plano em grupos para montar os <select>
  const groupedAttributes = useMemo(() => {
    const groups: Record<string, { 
      id: string, 
      name: string, 
      slug: string, 
      values: ProductOption[] 
    }> = {}

    product.options.forEach((opt) => {
      // Se o grupo (ex: Papel) ainda não existe, cria
      if (!groups[opt.attribute_id]) {
        groups[opt.attribute_id] = {
          id: opt.attribute_id,
          name: opt.attribute_name,
          slug: opt.attribute_slug,
          values: []
        }
      }
      // Adiciona a opção (ex: Couché) ao grupo
      groups[opt.attribute_id].values.push(opt)
    })

    return Object.values(groups)
  }, [product.options])

  // 3. Auto-selecionar a primeira opção de cada atributo ao carregar
  useEffect(() => {
    const defaults: Record<string, string> = {}
    
    groupedAttributes.forEach((group) => {
      if (group.values.length > 0) {
        // Seleciona o ID da primeira opção
        defaults[group.id] = group.values[0].value_id
      }
    })
    
    // Só atualiza se o selections estiver vazio (primeira carga)
    if (Object.keys(selections).length === 0) {
      setSelections(defaults)
    }
  }, [groupedAttributes]) // Removemos 'selections' da dependência para evitar loop

  const handleSelection = (attributeId: string, valueId: string) => {
    setSelections((prev) => ({
      ...prev,
      [attributeId]: valueId
    }))
  }

  function handleAddToCart() {
    // Monta lista legível de opções selecionadas
    const selectedOptionsReadable = groupedAttributes.map(group => {
      const selectedValueId = selections[group.id]
      const selectedOption = group.values.find(v => v.value_id === selectedValueId)
      
      return {
        name: group.name, // Ex: "Papel"
        value: selectedOption?.value_name || 'Padrão' // Ex: "Couché"
      }
    })

    addToCart({
      productId: product.id,
      productName: product.name, // Se tiver essa prop no objeto product
      quantity: qtd,
      options: selectedOptionsReadable
    })
    
    // Envia pro checkout
    router.push('/checkout')
  }

  return (
    <div className="mt-8 space-y-6">
      
      {/* Seção de Atributos */}
      {groupedAttributes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {groupedAttributes.map((attrGroup) => (
            <div key={attrGroup.id}>
              <label className="block text-sm font-bold text-gray-900 mb-1.5 capitalize">
                {attrGroup.name}
              </label>
              
              <select 
                className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none"
                // O value é o ID da opção selecionada para este atributo
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

      {/* Seção de Quantidade */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Quantidade</label>
        <div className="flex flex-wrap gap-2">
          {quantities.map((q) => {
            const isSelected = qtd === q
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

      {/* Botões de Ação */}
      <div className="flex flex-col gap-3">
        <button 
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