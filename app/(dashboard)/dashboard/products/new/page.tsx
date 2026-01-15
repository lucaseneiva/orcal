import { ProductForm } from '../form'
import { getAttributesByStoreId } from '@/lib/data/queries/attributes'
import { getCurrentStore } from '@/lib/utils/get-current-store'

export default async function NewProductPage() {
  const store = await getCurrentStore()
  if (!store) return null

  const allAttributes = await getAttributesByStoreId(store.id)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
      </div>
      <ProductForm allAttributes={allAttributes} primaryColor={store.primary_color}/>
    </div>
  )
} 