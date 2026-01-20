import { Database } from '@/src/lib/types/database.types'

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
  option_id: string
  option_name: string
  option_description: string | null
  attribute_id: string
  attribute_name: string
  attribute_slug: string
}

export interface ProductWithOptions extends ProductRaw {
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
  options?: CartItemOption[] 
}

export type QuoteRequestItem = CartItem