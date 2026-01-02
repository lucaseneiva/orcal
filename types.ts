export interface ProductOption {
  value_id: string;
  value_name: string;      // Ex: "Couché 300g"
  value_meta: string | null; // Ex: "#FF0000" ou "couche-300"
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