import Link from 'next/link'
import { getAttributeById } from '@/lib/data/queries/attributes'
import { AttributeHeaderForm } from '../../components/attribute-header-form'
import { AttributeValuesManager } from '../../components/attribute-values-manager'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params
  
  const attributeData = await getAttributeById(id)
  if (!attributeData) return notFound()

  const attribute = attributeData 

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Link href="/dashboard/attributes" className="text-sm text-gray-500 mb-4 block">
        ← Voltar
      </Link>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Editar Atributo
        </h1>
        
        <AttributeHeaderForm attribute={attribute} />
        <AttributeValuesManager attribute={attribute} />
      </div>
    </div>
  )
}