import { ProductForm } from '../form'
import { StoreRepo } from '@/lib/data/stores'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { createClient } from '@/lib/utils/supabase/server'

export default async function NewProductPage() {
  const store = await getCurrentStore()
  if (!store) return null

  const storeRepo = new StoreRepo(await createClient())
  const allAttributes = await storeRepo.getAttributes(store.id)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
      </div>
      <ProductForm allAttributes={allAttributes} />
    </div>
  )
} 