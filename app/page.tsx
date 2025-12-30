import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreHome } from '@/components/StoreHome'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { productRepository } from '@/lib/repositories/product-repository'
  
export default async function Home() {
  const store = await getCurrentStore();
  
  if (!store) {
    return <StoreNotFound />
  }
  
  const products = await productRepository.findByStoreId(store.id);

  return (
    <StoreHome
      store={store}
      products={products}
      primaryColor={store.primary_color || '#4578A'}
    />
  )
}
