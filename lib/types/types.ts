import { Database } from '@/lib/types/database.types'

// --- Helpers do Supabase ---
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
//type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// --- Tipos do Banco de Dados ---
export type ProductRaw = Tables<'products'>
export type Attribute = Tables<'attributes'>
export type Store = Tables<'stores'>

export type AttributeUpdate = Database['public']['Tables']['attributes']['Update']
export type AttributeInsert = Database['public']['Tables']['attributes']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert']

export type AttributeValueInsert =
  Database['public']['Tables']['attribute_values']['Insert']

// O Supabase não gera tipos para joins automaticamente, então criamos extensões
// 1. Opção de Produto (Vem do Join no Repository)
export interface ProductOption {
  value_id: string
  value_name: string
  description: string | null
  attribute_id: string
  attribute_name: string
  attribute_slug: string
}

// 2. Produto com Detalhes (Usado na Página de Produto)
export interface ProductWithDetails extends ProductRaw {
  options: ProductOption[]
}

// 3. Tipos do Carrinho e Pedido (CORREÇÃO PARA O EMAIL SERVICE)
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