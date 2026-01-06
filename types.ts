export interface ProductOption {
  value_id: string;
  value_name: string;      // Ex: "Couché 300g"
  description: string | null; // Ex: "#FF0000" ou "couche-300"
  attribute_id: string;
  attribute_name: string;  // Ex: "Papel"
  attribute_slug: string;  // Ex: "papel"
}

export interface Product {
  id: string;
  name: string;
  description: string | null; // ou string, dependendo de como volta do banco
  image_url: string | Blob | undefined;
  slug: string;
  options: ProductOption[]; 
}

export interface Profile {
  id: string;
  store_id: string;
}

export type OrderStatus = 'pending' | 'contacted' | 'completed' | 'cancelled'

// Estrutura de um item do carrinho (baseado no seu código de envio)
export interface OrderItem {
  productName: string
  quantity: number
  price?: number // Se tiver preço
  options?: {
    name: string
    value: string
  }[]
}

// Estrutura do Pedido vindo do Banco
export interface Order {
  id: string
  created_at: string
  customer_name: string
  customer_whatsapp: string
  items: OrderItem[] // O Supabase retorna JSON, mas nós tipamos como array
  total_items: number
  status: OrderStatus
}