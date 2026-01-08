import { Database } from '@/lib/types/database.types'

// Helpers nativos
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Tipos diretos do Banco (Fonte da Verdade)
export type ProductRaw = Tables<'products'>
export type Attribute = Tables<'attributes'>
export type Store = Tables<'stores'>

export type AttributeUpdate =
  Database['public']['Tables']['attributes']['Update']

export type AttributeInsert = 
  Database['public']['Tables']['attributes']['Insert']

export type ProductInsert =
  Database['public']['Tables']['products']['Insert']

export type QuoteRequestInsert =
  Database['public']['Tables']['quote_requests']['Insert']



// O Supabase não gera tipos para joins automaticamente, então criamos extensões
export interface ProductOption {
  value_id: string
  value_name: string
  description: string | null
  attribute_id: string
  attribute_name: string
  attribute_slug: string
}

// Exemplo: Produto completo com as opções (usado no front)
export interface ProductWithDetails extends ProductRaw {
  options: ProductOption[]
  // Se tiver preço no futuro, adicione aqui
}

// Exemplo: Pedido com itens (JSON)
export type QuoteStatus = Database['public']['Enums']['quote_status'] // Se for enum no banco
// ou export type OrderStatus = 'pending' | 'contacted' ...

export interface QuoteRequestItem {
  productName: string
  quantity: number
  price?: number
  options?: {
    name: string
    value: string
  }[]
}