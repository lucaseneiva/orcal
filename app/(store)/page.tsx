import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreHome } from '@/components/StoreHome'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { ProductDAO } from '@/lib/repositories/product.repo'
import { createClient } from '@/lib/utils/supabase/server'

export default async function Home() {
  const store = await getCurrentStore();

  if (!store) {
    return <StoreNotFound />
  }

  const productDAO = new ProductDAO(await createClient())
  const products = await productDAO.getStoreProducts(store.id)
  
  return (
    <StoreHome
      store={store}
      products={products}
      primaryColor={store.primary_color || '#4578A'}
    />
  )
}
