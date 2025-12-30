import { createClient } from '@/lib/utils/supabase/server'

class StoreRepository {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async findByDomain(domain: string | null) {
    if (!domain) return null
    
    const { data, error } = await (await this.supabase)
      .from('stores')
      .select('*')
      .eq('subdomain', domain)
      .single()

    return error ? null : data
  }
} 

export const storeRepository = new StoreRepository()