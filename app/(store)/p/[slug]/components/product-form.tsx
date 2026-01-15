'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/cart-context'
import { useProductConfigurator } from '../hooks/useProductConfigurator'
import { GroupedAttribute } from '@/lib/utils/product-logic'
import { ProductOption } from '@/lib/types/types'

interface ProductFormProps {
  product: {
    id: string
    name: string
    image_url: string | null
    options: ProductOption[]
    quantity_tiers?: number[]
    
  }
  groupedOptions: GroupedAttribute[]
  store: {
    primary_color?: string
    color?: string
  }
}

export default function ProductForm({ product, groupedOptions, store }: ProductFormProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const brandColor = store.primary_color || store.color || '#000000'

  // Hook handles state initialization and updates
  const { 
    selections, 
    quantity, 
    setQuantity, 
    handleSelectionChange, 
    availableQuantities 
  } = useProductConfigurator(product.options, product.quantity_tiers)

  function handleAddToCart() {
    // Map selections to readable string for the Cart
    const selectedOptionsReadable = groupedOptions.map(group => {
      const selectedValueId = selections[group.id]
      const selectedOption = group.values.find(v => v.option_id === selectedValueId)
      
      return {
        name: group.name,
        value: selectedOption?.option_name || 'Padrão'
      }
    })

    addToCart({
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      imageUrl: product.image_url ?? undefined,
      options: selectedOptionsReadable
    })
    
    router.push('/checkout')
  }

  return (
    <div className="mt-8 space-y-6">
      {groupedOptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {groupedOptions.map((attrGroup) => (
            <div key={attrGroup.id}>
              <label className="block text-sm font-bold text-gray-900 mb-1.5 capitalize">
                {attrGroup.name}
              </label>
              
              <select 
                className="w-full border border-gray-400 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none"
                value={selections[attrGroup.id] || ''}
                style={{ accentColor: brandColor }}
                onChange={(e) => handleSelectionChange(attrGroup.id, e.target.value)}
              >
                {attrGroup.values.map((val) => (
                  <option key={val.option_id} value={val.option_id}>
                    {val.option_name}
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
          {availableQuantities.map((q) => {
            const isSelected = quantity === q
            return (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
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