import { headers } from 'next/headers'
import { StoreService } from '@/lib/services/store-service'
import { StoreNotFound } from '@/components/StoreNotFound'
import { StoreLayout } from '@/components/StoreLayout'

export default async function Home() {
  const headerStack = await headers()
  const host = headerStack.get('host')

  const storeService = new StoreService()
  const data = await storeService.getStoreDataByHost(host)

  if (!data) {
    return <StoreNotFound />
  }

  return (
    <StoreLayout 
      store={data.store}
      products={data.products}
      primaryColor={data.primaryColor}
      host={host || ''}
    />
  )
}