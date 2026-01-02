import { createClient } from '@/lib/utils/supabase/server'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { notFound, redirect } from 'next/navigation'
import { ProductForm } from '../../form'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const store = await getCurrentStore()
  
  if (!store) redirect('/dashboard')

  const supabase = await createClient()
  
  // Buscar produto garantindo que pertence à loja atual
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('store_id', store.id)
    .single()

  if (!product) return notFound()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/dashboard/products" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
          ← Voltar para produtos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
