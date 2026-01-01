import { createClient } from '@/lib/utils/supabase/server'
import { Product, ProductOption } from '@/types'

class ProductRepository {
  private supabase

  constructor(supabase: any) {
    this.supabase = supabase
  }

  async findByStoreId(storeId: string) {
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

    // Se der erro ou não achar nada, retorna null
    if (error || !data) {
      console.error('Produto não encontrado:', error);
      return null;
    }

    // --- TRANSFORMAÇÃO DE DADOS (Unitária) ---
    // Aqui 'data' já é o produto, não precisamos fazer data.map(...)

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
      options: options, // Array limpo de opções
    };

    return product;
  }
}

export async function getProductRepository() {
  const supabase = await createClient()
  return new ProductRepository(supabase)
}