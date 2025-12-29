import { createClient } from '@/lib/utils/supabase/server'

export class ProductRepository {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async findByStoreId(storeId: string) {
    const { data } = await (await this.supabase)
      .from('products')
      .select('*')
      .eq('store_id', storeId)
    return data || []
  }
}