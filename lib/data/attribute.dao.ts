import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../types/database.types"


export class AttributeDAO {
  private supabase

  constructor (supabase: SupabaseClient<Database>){
    this.supabase = supabase
  }

  async getAttributeById(id: string){
    const { data, error } = await this.supabase
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
}



