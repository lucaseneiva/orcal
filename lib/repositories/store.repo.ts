import { createClient } from '@/lib/utils/supabase/server'
import { Store } from '../types/types'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'


export class StoreRepo {
  private supabase

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }


  async findByDomain(domain: string | null): Promise<Store | null> {
    if (!domain) return null


    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('domain', domain)
      .single()

    return error ? null : data
  }

  async getAttributes(storeId: string) {
    const { data } = await this.supabase
      .from('attributes')
      .select(`
        id,
        name,
        slug,
        attribute_values (
          id,
          name
        )
      `)
      .eq('store_id', storeId)

    return data || []
  }
}



