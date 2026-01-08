import { ProductDAO } from '@/lib/repositories/product.repo'
import { StoreDAO } from '@/lib/repositories/store.repo'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { notFound, redirect } from 'next/navigation'
import { ProductForm } from '../../form'
import { createClient } from '@/lib/utils/supabase/server'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')



  const productDAO = new ProductDAO(await createClient())
  const product = await productDAO.getProductById(id)

  if (!product) return notFound()

  const storeDAO = new StoreDAO(await createClient())
  const allAttributes = await storeDAO.getStoreAttributes(store.id)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
      </div>

      <ProductForm product={product} allAttributes={allAttributes} />
    </div>
  )
}