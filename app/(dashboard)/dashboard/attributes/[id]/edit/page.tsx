import Link from 'next/link'
import { getAttributeById } from '@/lib/data/queries/attributes'
import { AttributeHeaderForm } from '../../components/attribute-header-form'
import { AttributeValuesManager } from '../../components/attribute-values-manager'
import { notFound } from 'next/navigation'
import { getCurrentStore } from '@/lib/utils/get-current-store'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params

  const attributeData = await getAttributeById(id)
  if (!attributeData) return notFound()

  const store = await getCurrentStore()
  if (!store) return notFound()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">
        ← Voltar
      </Link>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Editar Atributo
        </h1>
        <AttributeHeaderForm attribute={attributeData} primaryColor={store.primary_color} />
        <AttributeValuesManager attribute={attributeData} primaryColor={store.primary_color} />
      </div>
    </div>
  )
}