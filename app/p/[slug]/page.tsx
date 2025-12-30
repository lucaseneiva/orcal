import { notFound } from 'next/navigation'
import { getProductRepository } from '@/lib/repositories/product-repository'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import ProductForm from './components/product-form'
import { createClient } from '@/lib/utils/supabase/server'
import { Database } from '@/types/supabase'

// Tipagem correta para a query com relacionamento
type AttributeWithValues = {
  id: string
  name: string
  slug: string
  attribute_values: {
    id: string
    label: string
    attribute_id: string
  }[]
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const supabase = createClient()
  const store = await getCurrentStore()
  const { slug } = await params
  const productRepository = await getProductRepository()
  const product = await productRepository.findBySlugAndStoreId(slug, store.id)

  const { data, error } = await (await supabase)
    .from('attributes')
    .select(`
      id,
      name,
      slug,
      attribute_values (
        id,
        label,
        attribute_id
      )
    `)
    .eq('store_id', store.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching attributes:', error)
  }

  const globalAttributes: AttributeWithValues[] = data ?? []
    
  if (!product) return notFound()

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="bg-gray-100 rounded-lg overflow-hidden h-96 sticky top-6 border border-gray-200">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-4 prose text-gray-600">
              <p>{product.description}</p>
            </div>
            <ProductForm 
              product={product} 
              store={store} 
              availableAttributes={globalAttributes} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}