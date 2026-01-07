import { createClient } from "../utils/supabase/server"

export const getAttributeById = async(id: string) => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('attributes')
        .select(`
        *,
        attribute_values (
          id,
          name,
          description
        )
      `)
        .eq('id', id)
        .single()

    return error ? null : data
}

