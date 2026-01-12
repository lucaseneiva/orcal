import { AttributeInsert, AttributeUpdate } from "../../types/types"
import { createClient } from "../../utils/supabase/server"

export async function createAttribute(payload: AttributeInsert) {
  const supabase = await createClient()

  const { error, data } = await supabase
    .from('attributes')
    .insert(payload)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateAttribute(id: string, payload: AttributeUpdate) {
  const supabase = await createClient()

  const { error, data } = await supabase
    .from('attributes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteAttribute(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attributes')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return null
}


