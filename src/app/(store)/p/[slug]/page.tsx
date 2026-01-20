import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Image as ImageIcon, ChevronLeft } from 'lucide-react'
import { getProductBySlugAndStoreId } from '@/src/lib/data/queries/products'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { groupProductOptions } from '@/src/lib/utils/product-logic'
import ProductForm from './components/product-form'
import AttributeDetails from './components/attribute-options'
import { Metadata } from 'next'

type PageProps = {
  params: Promise<{ slug: string }>
}

// New Metadata Function
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const store = await getCurrentStore()
  if (!store) return {}

  const { slug } = await params
  const product = await getProductBySlugAndStoreId(store.id, slug)

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return {
    title: `${product.name} | ${store.name}`,
    description: product.description || `Detalhes do produto ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : [],
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const store = await getCurrentStore()
  if (!store) notFound()

  const { slug } = await params
  const product = await getProductBySlugAndStoreId(store.id, slug)

  if (!product) return notFound()

  // Calculate groupings on Server once.
  const groupedOptions = groupProductOptions(product.options)

  return (
    <div className="p-8">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar para loja
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">

          {/* Image Column */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-square relative">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon size={48} strokeWidth={1.5} />
                  <span className="mt-2 text-sm font-medium">Sem imagem</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Column */}
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

            {/* Pass pre-calculated groups to Form */}
            <ProductForm
              product={product}
              groupedOptions={groupedOptions}
              store={store}
            />
          </div>
        </div>

        {/* Pass pre-calculated groups to Details */}
        <AttributeDetails
          groupedOptions={groupedOptions}
          brandColor={store.primary_color || '#000000'}
        />
      </main>
    </div>
  )
}