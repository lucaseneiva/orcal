import { createClient } from "@/lib/utils/supabase/server"

export async function getAttributeById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('attributes')
    .select(`
        *,
        options (
          *
        )
      `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getAttributesByStoreId(storeId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('attributes')
    .select(`
        *,
        options (
          *
        )
      `)
    .eq('store_id', storeId)

  return data || []
}