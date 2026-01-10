import { createClient } from "@/lib/utils/supabase/server";

/**
 * Busca os IDs dos atributos atuais do produto
 */
export async function getCurrentAttributeIds(productId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_attribute_values')
    .select('attribute_value_id')
    .eq('product_id', productId)

  if (error) {
    console.error('Erro ao buscar atributos:', error)
    return []
  }

  return data?.map(item => item.attribute_value_id) || []
}
