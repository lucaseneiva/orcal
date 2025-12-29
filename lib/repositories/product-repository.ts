import { createClient } from '@/lib/utils/supabase/server'

export class ProductRepository {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async findByTenantId(tenantId: string) {
    const { data } = await (await this.supabase)
      .from('products')
      .select('*')
      .eq('store_id', tenantId)

    return data || []
  }
}