import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/utils/supabase/server'
import { AttributeRepo } from '@/lib/repositories/attribute.repo'
import { AttributeWithValues } from '@/lib/types/attribute.types'

// Components
import { AttributeHeaderForm } from '../../components/attribute-header-form'
import { AttributeValuesManager } from '../../components/attribute-values-manager'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params
  
  const supabase = await createClient()
  const attributeRepo = new AttributeRepo(supabase)
  
  const attributeData = await attributeRepo.getById(id)
  if (!attributeData) return notFound()

  // Use the shared type instead of 'as unknown'
  const attribute = attributeData as AttributeWithValues

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