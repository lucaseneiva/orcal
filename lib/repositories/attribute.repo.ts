import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../types/database.types"
import { AttributeInsert, AttributeUpdate } from "../types/types"

export class AttributeRepo {
  private supabase

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }

  async getById(id: string) {
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

  async delete(id: string) {
    const { error } = await this.supabase
      .from('attributes')
      .delete()
      .eq('id', id)
      
    if (error) console.log(`Erro ao deletar atributo: ${error}`)
    
    return { error }
  }

  async create(payload: AttributeInsert) {
    const { error, data } = await this.supabase
      .from('attributes')
      .insert(payload)
      .select()
      .single()

    if ( error ) console.error('Erro ao criar atributo:', error)

    return { error, data }
  }

  async update(id: string, payload: AttributeUpdate) {
    const { error } = await this.supabase
      .from('attributes')
      .update(payload)
      .eq('id', id)

    if (error) console.error('Erro ao atualizar atributo:', error)

    return { error }
  }
  
}



