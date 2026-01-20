import { StoreNotFound } from '@/src/components/StoreNotFound'
import { StoreHome } from '@/src/components/StoreHome'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { getAllProductsByStoreId } from '@/src/lib/data/queries/products'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const store = await getCurrentStore()

  if (!store) {
    return {
      title: 'Loja não encontrada',
    }
  }

  return {
    title: store.name,
    description: `Catálogo digital de ${store.name}. Solicite seu orçamento online de forma rápida e prática.`,
    icons: {
      icon: store.logo_url || '/favicon.ico',
    },
    openGraph: {
      title: store.name,
      description: `Confira os produtos de ${store.name}`,
      images: store.logo_url ? [store.logo_url] : [],
    }
  }
}

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