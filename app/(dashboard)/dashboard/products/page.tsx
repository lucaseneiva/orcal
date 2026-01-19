import { getCurrentStore } from '@/lib/utils/get-current-store'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/server'
import { ProductList } from './components/product-list'
import { ProductEmptyState } from './components/product-empty-state'
import { DashboardPageHeader } from '../components/dashboard-page-header'

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
      <DashboardPageHeader
        title="Produtos"
        backHref="/dashboard"
      >
        <Link
          href="/dashboard/products/new"
          className="text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm active:translate-y-0.5"
          style={{ backgroundColor: primaryColor }}
        >
          + Novo Produto
        </Link>
      </DashboardPageHeader>

      <div className="max-w-6xl mx-auto">

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