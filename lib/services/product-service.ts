import { createClient } from '@/lib/utils/supabase/server'
import { Product, ProductOption } from '@/types'

class ProductService {
  private supabase

  constructor(supabase: any) {
    this.supabase = supabase
  }

  async getStoreProducts(storeId: string) {
    const { data } = await (await this.supabase)
      .from('products')
      .select('*')
      .eq('store_id', storeId)
    return data || []
  }

  async findBySlugAndStoreId(slug: string, storeId: string) {
    const { data } = await (await this.supabase)
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('store_id', storeId)
      .single()
    return data || null
  }

  async getStoreProduct(storeId: string, slug: string): Promise<Product | null> {
    const supabase = createClient();

    const { data, error } = await (await supabase)
      .from('products')
      .select(`
      id,
      name,
      description,
      slug,
      image_url,
      created_at,
      product_attribute_values (
        attribute_values (
          id,
          name,
          attributes (
            id,
            name,
            slug
          )
        )
      )
    `)
      .eq('store_id', storeId)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Produto não encontrado:', error);
      return null;
    }

    // --- TRANSFORMAÇÃO DE DADOS ---

    const options: ProductOption[] = data.product_attribute_values.map((pav: any) => {
      const val = pav.attribute_values;
      const attr = val.attributes;

      return {
        value_id: val.id,
        value_name: val.name,
        value_meta: val.value,
        attribute_id: attr.id,
        attribute_name: attr.name,
        attribute_slug: attr.slug,
      };
    });

    const product: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      slug: data.slug,
      options: options,
    };

    return product;
  }

  async getStoreAttributes(storeId: string) {
    const { data } = await (await this.supabase)
      .from('attributes')
      .select(`
        id,
        name,
        slug,
        attribute_values (
          id,
          name
        )
      `)
      .eq('store_id', storeId)
    
    return data || []
  }

  async getProductById(productId: string) {
    const { data, error } = await (await this.supabase)
      .from('products')
      .select(`
        id,
        name,
        description,
        slug,
        image_url,
        status,
        store_id,
        product_attribute_values (
          attribute_values (
            id,
            name
          )
        )
      `)
      .eq('id', productId)
      .single()

    if (error || !data) return null

    // --- TRANSFORMAÇÃO IMPORTANTE ---
    // Precisamos converter o retorno aninhado do banco para o formato "plano"
    // que o nosso formulário espera (array de options)
    
    const options = data.product_attribute_values.map((pav: any) => ({
      value_id: pav.attribute_values.id,
      value_name: pav.attribute_values.name
    }))

    return {
      ...data,
      options // O formulário vai usar isso para marcar os checkboxes
    }
  }
}

export async function getProductService() {
  const supabase = await createClient()
  return new ProductService(supabase)
}