import { notFound } from 'next/navigation'
import { ProductDAO } from '@/lib/data/product.dao'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import ProductForm from './components/product-form'
import Link from 'next/link'
import AttributeDetails from './components/attribute-options'
import { blob } from 'stream/consumers'
import { createClient } from '@/lib/utils/supabase/server'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const store = await getCurrentStore()
  if (store == null) notFound()

  const { slug } = await params
  const productDAO = new ProductDAO(await createClient())
  const product = await productDAO.getStoreProduct(store.id, slug)
  
  if (!product) return notFound()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão voltar */}
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para loja
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Grid principal: Imagem + Formulário */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          
          {/* Coluna da Imagem */}
          <div className="lg lg:top-24 h-fit">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-square">
              <img
                src={product.image_url ?? "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Coluna do Formulário */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 h-fit">
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {product.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            <ProductForm product={product} store={store} />
          </div>
        </div>

        {/* Seção de Detalhes (Full Width) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <AttributeDetails 
            options={product.options}
            brandColor={store.primary_color || store.primary_color || '#000000'}
          />
        </div>
      </main>
    </div>
  )
}