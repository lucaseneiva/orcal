import { createClient } from '@/src/lib/utils/supabase/server'
import { ProductWithOptions, ProductOption } from '@/src/lib/types/types'


export async function getAllProductsByStoreId(storeId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
  return data || []
}

async function getProductWithOptions(
  filters: { storeId?: string; slug?: string; id?: string }
): Promise<ProductWithOptions | null> {
  const supabase = await createClient();

  let query = supabase
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
    `);

  if (filters.storeId) query = query.eq('store_id', filters.storeId);
  if (filters.slug) query = query.eq('slug', filters.slug);
  if (filters.id) query = query.eq('id', filters.id);

  const { data, error } = await query.single();

  if (error || !data) {
    console.error('Produto não encontrado:', error);
    return null;
  }

  const productOptions: ProductOption[] = data.products_options.map((po: any) => ({
    option_id: po.options.id,
    option_name: po.options.name,
    option_description: po.options.description,
    attribute_id: po.options.attributes?.id,
    attribute_name: po.options.attributes?.name,
    attribute_slug: po.options.attributes?.slug,
  }));

  return {
    ...data,
    options: productOptions
  };
}

export async function getProductBySlugAndStoreId(
  storeId: string,
  slug: string
): Promise<ProductWithOptions | null> {
  return getProductWithOptions({ storeId, slug });
}

export async function getProductById(
  productId: string
): Promise<ProductWithOptions | null> {
  return getProductWithOptions({ id: productId });
}



