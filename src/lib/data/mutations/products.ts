import { createClient } from "@/src/lib/utils/supabase/server"
import { ProductInsert } from "@/src/lib/types/types"

export async function createProduct(payload: ProductInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(`Erro ao criar produto: ${error.message}`)
  return data
}


export async function updateProduct(id: string, storeId: string, payload: ProductInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .eq('store_id', storeId)
    .select()
    .single()

  if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`)
  return data
}


export async function upsertProduct(id: string | null, storeId: string, payload: ProductInsert) {
  if (id) {
    return updateProduct(id, storeId, payload)
  }
  return createProduct(payload)
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: 'Erro ao deletar' }
  }
}


