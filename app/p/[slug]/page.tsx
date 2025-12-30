import { notFound } from 'next/navigation'
import { productRepository } from '@/lib/repositories/product-repository'
import { getCurrentStore } from '@/lib/utils/get-current-store'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const store = await getCurrentStore();
  const { slug } = await params;
  const product = await productRepository.findBySlugAndStoreId(slug, store.id);
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden h-96">
             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-2xl font-medium mt-2 text-slate-600">{product.price}</p>
            
            <div className="mt-6 prose text-slate-500">
                <p>{product.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}