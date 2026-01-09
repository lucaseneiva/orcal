import { useState } from 'react'
import { ProductOption } from '@/lib/types/types'
import { getDefaultSelections } from '@/lib/utils/product-logic'

export function useProductConfigurator(
  options: ProductOption[], 
  quantities: number[] = [100, 250, 500, 1000]
) {
  // Initialize state lazily with the utility function
  const [selections, setSelections] = useState(() => getDefaultSelections(options))
  const [quantity, setQuantity] = useState(quantities[0])

  const handleSelectionChange = (attributeId: string, valueId: string) => {
    setSelections((prev) => ({
      ...prev,
      [attributeId]: valueId
    }))
  }

  return {
    selections,
    quantity,
    setQuantity,
    handleSelectionChange,
    availableQuantities: quantities
  }
}