import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import AddToCartButton from './components/AddToCartButton'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const headerStack = await headers()
  const host = headerStack.get('host')
  const { slug } = await params

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('subdomain', host)
    .single()

  if (!store) return notFound()

  const { data: product } = await supabase
    .from('products') 
    .select('*')
    .eq('store_id', store.id)
    .eq('slug', slug)
    .single()

  if (!product) return notFound()

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

            <div className="mt-8">
              <AddToCartButton 
                product={{ id: product.id, name: product.name, price: product.price }} 
                color={store.primaryColor} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}