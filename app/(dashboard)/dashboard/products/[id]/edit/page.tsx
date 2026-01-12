import { ProductRepo } from '@/lib/repositories/product.repo'
import { StoreRepo } from '@/lib/repositories/store.repo'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { notFound, redirect } from 'next/navigation'
import { ProductForm } from '../../form'
import { createClient } from '@/lib/utils/supabase/server'
import { ProductWithDetails } from '../../form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  // 1. Await params
  const { id } = await params
  
  // 2. Get Store and Auth context
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const supabase = await createClient()

  // 3. Fetch Product data
  const productRepo = new ProductRepo(supabase)
  const productData = await productRepo.getById(id)

  // 4. Handle 404
  if (!productData) return notFound()

  // 5. Fetch Attributes for the sidebar configuration
  const storeRepo = new StoreRepo(supabase)
  const allAttributes = await storeRepo.getAttributes(store.id)

  //6. Format and Cast the product
  const formattedProduct = {
    ...productData,
    options: productData.options || []
  } as unknown as ProductWithDetails

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
        <p className="text-sm text-gray-500">
          Atualize as informações e atributos do seu produto.
        </p>
      </div>

      <ProductForm 
        product={formattedProduct} 
        allAttributes={allAttributes} 
      />
    </div>
  )
}