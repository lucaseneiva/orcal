import { createClient } from '@/lib/utils/supabase/server'

class StoreRepository {
  private supabase

  constructor(supabase: any) {
    this.supabase = supabase
  }

  async findByDomain(domain: string | null) {
    if (!domain) return null
    
    const { data, error } = await (await this.supabase)
      .from('stores')
      .select('*')
      .eq('domain', domain)
      .single()

    return error ? null : data
  }
} 

export async function getStoreRepository() {
  const supabase = createClient();
  return new StoreRepository(supabase);
}