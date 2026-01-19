import { ProductForm } from '../form'
import { getCurrentStore } from '@/lib/utils/get-current-store'
import { DashboardPageHeader } from '../../components/dashboard-page-header'
import { createClient } from '@/lib/utils/supabase/server'

export default async function NewProductPage() {
  const store = await getCurrentStore()
  if (!store) return null

  const supabase = await createClient()

  const { data } = await supabase
    .from('attributes')
    .select(`
        *,
        options (
          *
        )
      `)
    .eq('store_id', store.id)

  const allAttributes = data || []

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <DashboardPageHeader
        title="Novo Produto"
        backHref="/dashboard"
      />
      <ProductForm allAttributes={allAttributes} primaryColor={store.primary_color} />
    </div>
  )
} 