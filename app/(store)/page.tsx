import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreHome } from '@/components/StoreHome'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { ProductRepo } from '@/lib/repositories/product.repo'
import { createClient } from '@/lib/utils/supabase/server'

export default async function Home() {
  const store = await getCurrentStore();

  if (!store) {
    return <StoreNotFound />
  }

  const productRepo = new ProductRepo(await createClient())
  const products = await productRepo.getFromStore(store.id)
  
  return (
    <StoreHome
      store={store}
      products={products}
      primaryColor={store.primary_color || '#4578A'}
    />
  )
}
