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
}

export async function getProductService() {
  const supabase = await createClient()
  return new ProductService(supabase)
}