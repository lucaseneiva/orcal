import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreHome } from '@/components/StoreHome'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { getProductService } from '@/lib/services/product-service'

export default async function Home() {
  const store = await getCurrentStore();

  if (!store) {
    return <StoreNotFound />
  }

  const productService = await getProductService()
  const products = await productService.getStoreProducts(store.id)

  return (
    <StoreHome
      store={store}
      products={products}
      primaryColor={store.primary_color || '#4578A'}
    />
  )
}
