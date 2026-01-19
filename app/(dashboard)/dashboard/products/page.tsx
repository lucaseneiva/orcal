import { getCurrentStore } from '@/lib/utils/get-current-store'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/server'
import { ProductHeader } from './components/product-header'
import { ProductList } from './components/product-list'
import { ProductEmptyState } from './components/product-empty-state'

export default async function ProductsPage() {
  
  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  const primaryColor = store.primary_color ?? '#000000'

  return (
    <div className="p-6">
      <Link href="/dashboard/" className="text-sm text-gray-500 mb-4 block">
        ← Voltar
      </Link>

      <div className="max-w-6xl mx-auto">

        <ProductHeader primaryColor={primaryColor} />

        <div className="bg-white border rounded-xl overflow-hidden">
          {products && products.length > 0 ? (
            <ProductList products={products} primaryColor={primaryColor} />
          ) : (
            <ProductEmptyState primaryColor={primaryColor} />
          )}
        </div>
      </div>
    </div>
  )
}