import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/src/lib/utils/supabase/server'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { DashboardPageHeader } from '../../../components/dashboard-page-header'
import { ProductForm } from '../../form'
import { ProductOption, ProductWithOptions } from '@/src/lib/types/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const store = await getCurrentStore()
  if (!store) redirect('/dashboard')

  const supabase = await createClient()

  const productQuery = supabase
    .from('products')
    .select(`
      *,
      products_options (
        options (
          id, name, description,
          attributes ( id, name, slug )
        )
      )
    `)
    .eq('id', id)
    .single()

  const attributesQuery = supabase
    .from('attributes')
    .select('*, options(*)')
    .eq('store_id', store.id)

  const [productRes, attributesRes] = await Promise.all([productQuery, attributesQuery])

  if (productRes.error || !productRes.data) return notFound()

  const rawProduct = productRes.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenedOptions: ProductOption[] = rawProduct.products_options.map((po: any) => ({
    option_id: po.options.id,
    option_name: po.options.name,
    option_description: po.options.description,
    attribute_id: po.options.attributes?.id,
    attribute_name: po.options.attributes?.name,
    attribute_slug: po.options.attributes?.slug,
  }))

  const product: ProductWithOptions = {
    ...rawProduct,
    options: flattenedOptions
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <DashboardPageHeader
          title="Editar Produto"
          subtitle="Atualize as informações e atributos do seu produto."
          backHref="/dashboard/products"
        />

        <ProductForm
          product={product}
          allAttributes={attributesRes.data || []}
          primaryColor={store.primary_color}
        />
      </div>
    </div>
  )
}