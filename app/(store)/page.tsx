import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreHome } from '@/components/StoreHome'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { getAllProductsByStoreId } from '@/lib/data/queries/products'
import { createClient } from '@/lib/utils/supabase/server'

export default async function Home() {
  const store = await getCurrentStore();

  if (!store) {
    return <StoreNotFound />
  }

  const products = await getAllProductsByStoreId(store.id)
  
  return (
    <StoreHome
      store={store}
      products={products}
      primaryColor={store.primary_color || '#4578A'}
    />
  )
}
