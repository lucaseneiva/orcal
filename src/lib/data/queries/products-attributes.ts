import { createClient } from "@/src/lib/utils/supabase/server";

/**
 * Busca os IDs dos atributos atuais do produto
 */
export async function getCurrentAttributeIds(productId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products_options')
    .select('option_id')
    .eq('product_id', productId)

  if (error) {
    console.error('Erro ao buscar atributos:', error)
    return []
  }

  return data?.map(item => item.option_id) || []
}
