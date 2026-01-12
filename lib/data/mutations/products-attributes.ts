import { createClient } from "../../utils/supabase/server"

type AttributeRelation = {
  product_id: string
  option_id: string
}

/**
 *  Delete + Insert
 */
export async function replaceAll(productId: string, newAttributeIds: string[]) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from('products_options')
    .delete()
    .eq('product_id', productId)

  if (deleteError) {
    throw new Error(`Erro ao limpar atributos: ${deleteError.message}`)
  }

  
  if (newAttributeIds.length === 0) return

  const payload: AttributeRelation[] = newAttributeIds.map(valueId => ({
    product_id: productId,
    option_id: valueId
  }))

  const { error: insertError } = await supabase
    .from('products_options')
    .insert(payload)

  if (insertError) {
    throw new Error(`Erro ao inserir atributos: ${insertError.message}`)
  }
}

/**
 * Estratégia 2: Diff
 */
// export async function syncAttributes(productId: string, newAttributeIds: string[]) {
//   const supabase = await createClient();

//   const currentIds = await getCurrentAttributeIds(productId)

//   // Calcula o que adicionar e o que remover
//   const toAdd = newAttributeIds.filter(id => !currentIds.includes(id))
//   const toRemove = currentIds.filter(id => !newAttributeIds.includes(id))

//   // Remove apenas o que precisa
//   if (toRemove.length > 0) {
//     const { error } = await supabase
//       .from('product_attribute_values')
//       .delete()
//       .eq('product_id', productId)
//       .in('attribute_value_id', toRemove)

//     if (error) console.error('Erro ao remover atributos:', error)
//   }

//   // Adiciona apenas o que precisa
//   if (toAdd.length > 0) {
//     const payload: AttributeRelation[] = toAdd.map(valueId => ({
//       product_id: productId,
//       attribute_value_id: valueId
//     }))

//     const { error } = await supabase
//       .from('product_attribute_values')
//       .insert(payload)

//     if (error) console.error('Erro ao adicionar atributos:', error)
//   }
// }
