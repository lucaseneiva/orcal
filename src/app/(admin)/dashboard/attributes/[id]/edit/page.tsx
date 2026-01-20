import { AttributeHeaderForm } from '../../../../../../components/modules/attributes/attribute-header-form'
import { OptionsManager } from '../../../../../../components/modules/attributes/options-manager'
import { notFound } from 'next/navigation'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import { createClient } from '@/src/lib/utils/supabase/server'
import { DashboardPageHeader } from '../../../../../../components/layout/dashboard-header'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: attributeData } = await supabase
    .from('attributes')
    .select(`
        *,
        options (
          *
        )
      `)
    .eq('id', id)
    .single()

  if (!attributeData) return notFound()

  const store = await getCurrentStore()

  if (!store) return notFound()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="max-w-4xl mx-auto space-y-8">
        <DashboardPageHeader
          title="Editar Atributo"
          backHref="/dashboard/attributes"
        >
        </DashboardPageHeader>
        <AttributeHeaderForm attribute={attributeData} primaryColor={store.primary_color} />
        <OptionsManager attribute={attributeData} primaryColor={store.primary_color} />
      </div>
    </div>
  )
}