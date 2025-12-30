import { notFound } from 'next/navigation'
import { getProductRepository } from '@/lib/repositories/product-repository'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import ProductForm from './components/product-form'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const store = await getCurrentStore(); // Aqui tem as configs da loja (logo, cor, nome)
  const { slug } = await params;
  
  const productRepository = await getProductRepository()
  const product = await productRepository.findBySlugAndStoreId(slug, store.id)
  
  if (!product) return notFound();
  
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
            <p className="text-2xl font-bold mt-2 text-gray-900">
               {product.price}
            </p>
            
            <div className="mt-4 prose text-gray-600">
                <p>{product.description}</p>
            </div>

            {/* Passamos o PRODUCT e a STORE para o form */}
            <ProductForm product={product} store={store} />

          </div>
        </div>
      </main>
    </div>
  )
}