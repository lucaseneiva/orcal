import { Database } from '@/lib/types/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type ProductRaw = Tables<'products'>
export type Attribute = Tables<'attributes'>
export type Store = Tables<'stores'>

export type AttributeUpdate = Database['public']['Tables']['attributes']['Update']
export type AttributeInsert = Database['public']['Tables']['attributes']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert']
export type OptionInsert = Database['public']['Tables']['options']['Insert']
export type OptionUpdate = Database['public']['Tables']['options']['Update']

type AttributeRow = Database['public']['Tables']['attributes']['Row']
type OptionRow = Database['public']['Tables']['options']['Row']

export interface AttributeWithOptions extends AttributeRow {
  options: OptionRow[]
}

export interface ProductOption {
  value_id: string
  value_name: string
  description: string | null
  attribute_id: string
  attribute_name: string
  attribute_slug: string
}

export interface ProductWithDetails extends ProductRaw {
  options: ProductOption[]
}

export type CartItemOption = {
  name: string
  value: string
}

export type CartItem = {
  productId?: string
  productName: string
  quantity: number
  imageUrl?: string
  // 'options' é opcional pois o produto pode não ter variações
  options?: CartItemOption[] 
}

// Alias para manter compatibilidade se você já usou QuoteRequestItem em outros lugares
export type QuoteRequestItem = CartItem