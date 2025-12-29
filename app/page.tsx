import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreHome } from '@/components/StoreHome'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { ProductRepository } from '@/lib/repositories/product-repository'
  
export default async function Home() {
  const store = await getCurrentStore();
  const productRepo = new ProductRepository();
  if (!store) {
    return <StoreNotFound />
  }
  
  const products = await productRepo.findByStoreId(store.id);

  return (
    <StoreHome
      store={store}
      products={products}
      primaryColor={store.primary_color || '#4578A'}
    />
  )
}