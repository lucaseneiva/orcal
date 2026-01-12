import { createClient } from '@/lib/utils/supabase/server'
import { ProductWithDetails, ProductOption } from '@/lib/types/types'


export async function getAllProductsByStoreId(storeId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
  return data || []
}

// export async function getProductBySlugAndStoreId(slug: string, storeId: string) {
//   const supabase = await createClient();

//   const { data } = await supabase
//     .from('products')
//     .select('*')
//     .eq('slug', slug)
//     .eq('store_id', storeId)
//     .single()
//   return data || null
// }

export async function getProductBySlugAndStoreId(storeId: string, slug: string): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      products_options (
        options (
          id,
          name,
          description, 
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

  const options: ProductOption[] = data.products_options.map((pav: any) => {
    const val = pav.options;
    const attr = val.attributes;

    return {
      value_id: val.id,
      value_name: val.name,
      description: val.description,
      attribute_value_description: val.description,
      attribute_id: attr.id,
      attribute_name: attr.name,
      attribute_slug: attr.slug,
    };
  });

  const product: ProductWithDetails = {
    id: data.id,
    name: data.name,
    description: data.description,
    image_url: data.image_url,
    slug: data.slug,
    options: options,
    created_at: data.created_at,
    status: data.status,
    updated_at: data.updated_at,
    store_id: data.store_id,
    display_order: data.display_order
  };

  return product;
}


export async function getProductById(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
        id,
        name,
        description,
        slug,
        image_url,
        status,
        store_id,
        products_options (
          options (
            id,
            name,
            description
          )
        )
      `)
    .eq('id', productId)
    .single()

  if (error || !data) return null

  const options = data.products_options.map((pav: any) => ({
    value_id: pav.options.id,
    value_name: pav.options.name
  }))

  return {
    ...data,
    options
  }
}










