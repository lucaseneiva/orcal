import { createClient } from '@/lib/utils/supabase/server'

class ProductRepository {
  private supabase

  constructor(supabase: any) {
    this.supabase = supabase
  }

  async findByStoreId(storeId: string) {
    const { data } = await (await this.supabase)
      .from('products')
      .select('*')
      .eq('store_id', storeId)
    return data || []
  }

  async findBySlugAndStoreId(slug: string, storeId: string) {
    const { data } = await (await this.supabase)
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('store_id', storeId)
      .single()
    return data || null
  }
}

export async function getProductRepository() {
  const supabase = await createClient()
  return new ProductRepository(supabase)
}