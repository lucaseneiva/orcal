import { AttributeHeaderForm } from '../../../../../components/modules/attributes/attribute-header-form'
import { getCurrentStore } from '@/src/lib/utils/get-current-store'
import NotFound from '@/src/app/not-found'
import { DashboardPageHeader } from '../../../../../components/layout/dashboard-header'

export default async function NewAttributePage() {

  const store = await getCurrentStore()
  if (!store) return NotFound()

  return (

    <div className="p-8 bg-gray-50 min-h-screen">
      <DashboardPageHeader
        title="Novo Atributo"
        backHref="/dashboard/attributes"
      ></DashboardPageHeader>

      <AttributeHeaderForm primaryColor={store.primary_color} />
    </div>
  )
}